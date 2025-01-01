'use client';

import { TaskParams } from '@/type/type';
import { useState } from 'react';

export default function HomePage() {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [style, setStyle] = useState<string>('anime');
    const [resolution, setResolution] = useState<string>('1024*1024');
    const [seed, setSeed] = useState<number>(-1);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!prompt.trim()) {
            alert('提示词不能为空！');
            return;
        }

        setStatus('pending');
        setBase64Image(null);

        const taskArgs: TaskParams = {
            prompt,
            negativePrompt,
            style,
            resolution,
            seed
        };

        const res = await fetch('/api/t2i-queue-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskArgs),
        });

        const taskId: string = await res.json();
        setTaskId(taskId);

        const interval = setInterval(async () => {
            const resultRes = await fetch(`/api/t2i-get-result?taskId=${taskId}`);
            const resultData = await resultRes.json();

            if (resultData.status === 'done') {
                setBase64Image(resultData.image);
                setStatus('done');
                clearInterval(interval);
            }
        }, 3000);
    };

    return (
        <div className='flex flex-col items-center p-8 bg-gray-200 min-h-screen'>
            <h1 className='text-center text-3xl mb-8'>动漫风格ai图像生成</h1>

            <form onSubmit={handleSubmit} className='w-full max-w-4xl bg-white p-6 rounded shadow'>
                <div className='mb-6'>
                    <label htmlFor='prompt' className='block text-lg mb-2'>
                        提示词
                    </label>
                    <textarea
                        id='prompt'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='请输入提示词（仅英文）...'
                        className='w-full p-3 border border-gray-300 rounded text-lg resize-y'
                        rows={3}
                    ></textarea>
                </div>

                <div className='mb-6'>
                    <label htmlFor='prompt' className='block text-lg mb-2'>
                        负面提示词
                    </label>
                    <textarea
                        id='negative_prompt'
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder='请输入负面提示词（仅英文）...'
                        className='w-full p-3 border border-gray-300 rounded text-lg resize-y'
                        rows={3}
                    ></textarea>
                </div>

                <div className='grid grid-cols-2 gap-6 mb-6'>
                    <div>
                        <label className='block text-lg mb-2'>选择风格</label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className='w-full p-3 border border-gray-300 rounded text-lg'
                        >
                            <option value='anime'>纯净</option>
                            <option value='pk_trainer'>宝可梦训练师</option>
                            <option value='mucha'>穆夏</option>
                            <option value='cutedoodle'>可爱涂鸦</option>
                            <option value='isometric'>等距瓷砖</option>
                        </select>
                    </div>

                    <div>
                        <label className='block text-lg mb-2'>随机数种子</label>
                        <input
                            type='range'
                            min='-1'
                            max='1000'
                            value={seed}
                            onChange={(e) => setSeed(Number(e.target.value))}
                            className='w-full'
                        />
                        <div className='text-center'>{seed}</div>
                    </div>

                    <div className='col-span-2'>
                        <label className='block text-lg mb-2'>分辨率</label>
                        <select
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            className='w-full p-3 border border-gray-300 rounded text-lg'
                        >
                            <option value='1024 * 1024'>1024 x 1024</option>
                            <option value='1152 * 896'>1152 x 896</option>
                            <option value='896 * 1152'>896 x 1152</option>
                            <option value='1216 * 832'>1216 x 832</option>
                            <option value='832 * 1216'>832 x 1216</option>
                            <option value='1344 * 768'>1344 x 768</option>
                            <option value='768 * 1344'>768 x 1344</option>
                            <option value='1536 * 640'>1536 x 640</option>
                            <option value='640 * 1536'>640 x 1536</option>
                        </select>
                    </div>
                </div>

                <div className='text-center'>
                    <button
                        type='submit'
                        className='w-1/3 p-3 bg-blue-500 text-white rounded hover:bg-blue-600'
                    >
                        生成
                    </button>
                </div>
            </form>

            <div
                className='w-full max-w-4xl bg-[#dddddd] mt-8 p-6 h-96 flex items-center justify-center border border-gray-300 rounded'>
                {status === 'pending' && <p className='text-lg'>生成图片中...</p>}
                {base64Image && (
                    <img src={base64Image} alt='Generated AI Image' className='w-full max-h-full object-contain'/>

                )}
            </div>
        </div>
    );
}
