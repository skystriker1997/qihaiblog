import Redis from "ioredis";
import crypto from 'crypto';
import { TaskParams } from "@/type/type";

const redis = new Redis();



export async function addTask(taskArgs: TaskParams): Promise<string> {
    const id = crypto.createHash('sha256').update(JSON.stringify(taskArgs) + Date.now().toString()).digest('hex');
    const task = JSON.stringify({id, taskArgs});
    console.log(task);
    await redis.lpush('taskQueue', task);
    return id;
}


export async function getNextTask(): Promise< string | null> {
    return redis.rpop('taskQueue');
}


export async function markTaskAsDone(id: string, base64Image: string): Promise<void> {
    await redis.hset('completedTasks', id, base64Image);
}


export async function getBase64Image(id: string): Promise<string | null> {
    const base64Image = await redis.hget('completedTasks', id);
    if (base64Image) {
        await redis.hdel('completedTasks', id);
    }
    return base64Image;
}