import { NextRequest, NextResponse } from 'next/server';
import { getBase64Image } from '@/libs/t2i-task-service';


export async function GET(req: NextRequest) {
    const taskId = req.nextUrl.searchParams.get('taskId');

    if (!taskId) {
        return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const base64Image = await getBase64Image(taskId);
    if (!base64Image) {
        return NextResponse.json({ status: 'pending' });
    }

    return NextResponse.json({ status: 'done', image: base64Image });
}
