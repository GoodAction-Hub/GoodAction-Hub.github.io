import { NextResponse } from 'next/server';
import { fetchActivities } from '@/lib/activities';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const data = await fetchActivities();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to fetch data from external API:', err);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
