import { NextResponse } from 'next/server';
import { getMessagesByConversationId, addMessageToConversation } from '@/lib/db/client';

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const conversationId = params.id;

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'Keine ID angegeben' }, { status: 400 });
    }

    const messages = await getMessagesByConversationId(conversationId);
    return NextResponse.json({ success: true, messages });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const conversationId = params.id;
    const body = await req.json();
    const { content, senderName, senderType = 'customer' } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { success: false, error: 'Nachrichteninhalt ist erforderlich' },
        { status: 400 }
      );
    }

    const result = await addMessageToConversation({
      conversationId,
      senderType,
      senderName: senderName || 'Kunde',
      content,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
