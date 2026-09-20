import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const items = db.prepare(`
      SELECT * FROM smart_groceries
      WHERE user_id = ?
      ORDER BY category ASC, created_at DESC
    `).all(user.id);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Fetch groceries error:', error);
    return NextResponse.json({ error: 'Failed to fetch grocery items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { category = 'PANTRY', itemName, quantity = '1' } = await req.json();

    if (!itemName) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    const id = `groc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    db.prepare(`
      INSERT INTO smart_groceries (id, user_id, category, item_name, quantity, purchased)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(id, user.id, category.toUpperCase(), itemName, quantity);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Add grocery error:', error);
    return NextResponse.json({ error: 'Failed to add grocery item' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id, purchased } = await req.json();

    db.prepare(`
      UPDATE smart_groceries
      SET purchased = ?
      WHERE id = ? AND user_id = ?
    `).run(purchased ? 1 : 0, id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update grocery error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM smart_groceries WHERE id = ? AND user_id = ?').run(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete grocery error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
