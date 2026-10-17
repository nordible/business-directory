import { NextResponse } from 'next/server';
import { getLegalForms } from '@/lib/db/client';

export async function GET() {
  try {
    const legalForms = await getLegalForms();
    return NextResponse.json({ legalForms });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
