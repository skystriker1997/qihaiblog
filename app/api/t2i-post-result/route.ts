import { NextRequest, NextResponse } from 'next/server';
import { markTaskAsDone } from '@/libs/t2i-task-service';



const API_TOKEN = process.env.API_TOKEN;

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${API_TOKEN}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, base64Image } = await req.json();

    if (!id || !base64Image) {
        return NextResponse.json({ error: 'id and base64Image are required' }, { status: 400 });
    }

    await markTaskAsDone(id, base64Image);
    return NextResponse.json({ success: true });
}
