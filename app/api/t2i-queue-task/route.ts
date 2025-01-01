import { NextRequest, NextResponse } from 'next/server';
import { addTask } from '@/libs/t2i-task-service';
import { TaskParams } from "@/type/type";



export async function POST(req: NextRequest) {
    const taskArgs: TaskParams = await req.json();
    const taskId: string = await addTask(taskArgs);
    return NextResponse.json(taskId);
}
