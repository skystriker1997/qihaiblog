import { NextRequest, NextResponse } from 'next/server';
import { addTask } from '@/libs/t2i-task-service';
import { TaskParams } from "@/type/type";


const checkServiceStatus = async () => {
    const res = await fetch(process.env.SERVICE_PORT+'/api/t2i-service-status');
    return res.json();
}


export async function POST(req: NextRequest) {
    const { isServiceAvailable } = await checkServiceStatus();
    if(isServiceAvailable) {
        const taskArgs: TaskParams = await req.json();
        const taskId: string = await addTask(taskArgs);
        return NextResponse.json({ taskId });
    } else {
        return NextResponse.json({ taskId: "-1" });
    }

}
