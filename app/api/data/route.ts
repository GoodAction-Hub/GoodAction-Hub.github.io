import { NextResponse } from 'next/server'
import { DeadlineItem, EventData } from '@/lib/data'

export const dynamic = 'force-static'

const DATA_API_URL =
  'https://goodaction-hub.github.io/GoodAction-data/activities.json'

interface ExternalEventData {
  id: string
  link: string
  start_time?: string
  end_time?: string
  timeline: { deadline: string; comment: string }[]
  timezone: string
  place: string
}

interface ExternalDeadlineItem {
  title: string
  description: string
  category: 'meetup' | 'conference' | 'competition'
  tags: string[]
  events: ExternalEventData[]
}

function transformEvent(event: ExternalEventData): EventData {
  const startTime = event.start_time ?? event.timeline[0]?.deadline ?? ''
  const startDate = startTime ? new Date(startTime.replace(' ', 'T')) : null
  const year = startDate ? startDate.getFullYear() : new Date().getFullYear()

  const formatDateToChinese = (d: Date) =>
    `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  let date = startDate ? formatDateToChinese(startDate) : ''
  if (startDate && event.end_time) {
    const endDate = new Date(event.end_time.replace(' ', 'T'))
    if (endDate.getTime() !== startDate.getTime()) {
      date = `${date}-${endDate.getMonth() + 1}月${endDate.getDate()}日`
    }
  }

  return {
    year,
    id: event.id,
    link: event.link,
    timeline: event.timeline,
    timezone: event.timezone,
    date,
    place: event.place,
  }
}

function transformItem(item: ExternalDeadlineItem): DeadlineItem {
  return {
    title: item.title,
    description: item.description,
    category: item.category === 'meetup' ? 'activity' : item.category,
    tags: item.tags ?? [],
    events: item.events.map(transformEvent),
  }
}

export async function GET() {
  try {
    const res = await fetch(DATA_API_URL, { cache: 'force-cache' })
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from external API' },
        { status: 502 },
      )
    }
    const externalData = (await res.json()) as ExternalDeadlineItem[]
    const data: DeadlineItem[] = externalData.map(transformItem)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Failed to fetch data from external API:', err)
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
}
