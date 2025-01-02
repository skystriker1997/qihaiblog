import torch
from diffusers import DiffusionPipeline, EulerDiscreteScheduler
import time
import requests
import base64
import io
import re
import json
import queue
import threading
from typing import Optional
import os


REMOTE_BASE_URL = os.environ['REMOTE_BASE_URL']

GET_TASK_URL = REMOTE_BASE_URL + '/api/t2i-get-task'
POST_RESULT_URL = REMOTE_BASE_URL + '/api/t2i-post-result'
SERVICE_STATUS_URL = REMOTE_BASE_URL + '/api/t2i-service-status'

API_TOKEN = os.environ.get('API_TOKEN')

shutdown_flag = threading.Event()
task_queue = queue.Queue()


def notify_service_status(status: bool):
    requests.post(
        SERVICE_STATUS_URL,
        json={'status': status},
        headers={'Authorization': f'Bearer {API_TOKEN}'},
    )


class TaskFetcher(threading.Thread):
    def __init__(self):
        super().__init__()
        self.daemon = True

    def run(self):
        while not shutdown_flag.is_set():
            try:
                response = requests.get(
                    GET_TASK_URL,
                    headers={'Authorization': 'Bearer ' + API_TOKEN}
                )
                if response.status_code == 204:
                    time.sleep(5)
                    continue
                elif response.status_code != 200:
                    print(f'Error fetching task: {response.status_code} - {response.text}')
                    time.sleep(5)
                    continue

                task = json.loads(json.loads(response.text)['task'])
                task_queue.put(task)

            except Exception as e:
                print(f"Error in task fetcher: {e}")
                time.sleep(5)


class ImageGenerator(threading.Thread):
    def __init__(self, t2i_pipe: DiffusionPipeline):
        super().__init__()
        self.t2i_pipe = t2i_pipe
        self.style_trigger = {
            "mucha": "Alphonse Mucha Style page",
            "cutedoodle": "cute doodle",
            "isometric": "zavy-ctsmtrc, isometric",
            "pk_trainer": "",
            "anime": ""
        }
        self.quality_amplifier = "masterpiece, best quality, very aesthetic, absurdres"
        self.defect_barrier = "lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]"
        self.sampling_steps = 28
        self.cfg_scale = 7
        self.lora_scale = 1

    def process_task(self, task: dict) -> Optional[Exception]:
        try:
            task_id = task["id"]
            prompt = task['taskArgs']['prompt']
            negative_prompt = task['taskArgs']['negativePrompt']

            random_seed = task['taskArgs']['seed']

            resolution_pattern = r'(\d+)\s*\*\s*(\d+)'
            width, height = re.findall(resolution_pattern, task['taskArgs']['resolution'])[0]
            width = int(width)
            height = int(height)

            style = task['taskArgs']['style']

            prompt += (f", {self.quality_amplifier}" + f", {self.style_trigger[style]}")
            negative_prompt += f", {self.defect_barrier}"

            self.t2i_pipe.enable_lora()
            if style != "anime":
                self.t2i_pipe.set_adapters(style)
            else:
                self.t2i_pipe.disable_lora()

            image = self.t2i_pipe(
                prompt,
                negative_prompt=negative_prompt,
                cross_attention_kwargs={"scale": self.lora_scale},
                height=height,
                width=width,
                num_inference_steps=self.sampling_steps,
                guidance_scale=self.cfg_scale,
                generator=torch.manual_seed(random_seed)
            ).images[0]

            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            base64_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
            base64_image = "data:image/png;base64," + base64_image

            result_response = requests.post(
                POST_RESULT_URL,
                json={'id': task_id, 'base64Image': base64_image},
                headers={'Authorization': f'Bearer {API_TOKEN}'}
            )

            if result_response.status_code == 200:
                print(f"Successfully processed task {task_id}")
            else:
                print(f"Error posting result: {result_response.status_code} - {result_response.text}")

        except Exception as e:
            print(f"Error processing task: {e}")
            return e

    def run(self):
        while not shutdown_flag.is_set() or not task_queue.empty():
            try:
                task = task_queue.get(timeout=5)
                self.process_task(task)
                task_queue.task_done()
            except queue.Empty:
                continue
            except Exception as e:
                print(f"Error in image generator: {e}")
                if task_queue.qsize() > 0:
                    task_queue.task_done()


def main():
    try:
        notify_service_status(True)

        t2i_pipe = DiffusionPipeline.from_pretrained(
            "cagliostrolab/animagine-xl-3.1",
            torch_dtype=torch.float16,
            use_safetensors=True,
        )
        t2i_pipe.load_lora_weights("./lora/pk_trainer_xl_v1.safetensors", adapter_name="pk_trainer")
        t2i_pipe.load_lora_weights("./lora/Alphonse-Mucha-Style.safetensors", adapter_name="mucha")
        t2i_pipe.load_lora_weights("./lora/cutedoodle_XL-000012.safetensors", adapter_name="cutedoodle")
        t2i_pipe.load_lora_weights("./lora/zavy-ctsmtrc-sdxl.safetensors", adapter_name="isometric")
        t2i_pipe.scheduler = EulerDiscreteScheduler.from_config(t2i_pipe.scheduler.config)
        t2i_pipe = t2i_pipe.to("cuda")

        task_fetcher = TaskFetcher()
        image_generator = ImageGenerator(t2i_pipe)

        task_fetcher.start()
        image_generator.start()

        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nShutdown initiated. Processing remaining tasks...")
        shutdown_flag.set()

        task_queue.join()
        print("All tasks completed. Shutting down...")

    finally:
        notify_service_status(False)


if __name__ == "__main__":
    main()