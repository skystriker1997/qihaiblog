import { NextRequest, NextResponse } from 'next/server';
import { getNextTask } from '@/libs/t2i-task-service';


const API_TOKEN = process.env.API_TOKEN;

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${API_TOKEN}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task: string|null = await getNextTask();
    if (!task) {
        return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({task});
}
