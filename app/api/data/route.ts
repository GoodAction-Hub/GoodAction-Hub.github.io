import { NextResponse } from 'next/server';
import {
  ACTIVITIES_API_URL,
  ExternalDeadlineItem,
  transformItem,
} from '@/lib/activities';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const res = await fetch(ACTIVITIES_API_URL, { cache: 'force-cache' });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from external API' },
        { status: 502 },
      );
    }
    const externalData = (await res.json()) as ExternalDeadlineItem[];
    const data = externalData.map(transformItem);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to fetch data from external API:', err);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
