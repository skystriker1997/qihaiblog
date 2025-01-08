import { NextRequest, NextResponse } from 'next/server';

const API_TOKEN = process.env.API_TOKEN;

let isServiceAvailable = false;


export function GET() {
    return NextResponse.json( {isServiceAvailable} );
}

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${API_TOKEN}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();
    isServiceAvailable = status;
    return NextResponse.json({ message: 'Service status updated successfully' });
}

