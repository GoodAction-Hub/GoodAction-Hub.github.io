import { NextResponse } from 'next/server'
import yaml from 'yaml'
import fs from 'fs'
import path from 'path'
import { DeadlineItem } from '@/lib/data'

export const dynamic = 'force-static'

let STATIC_DATA: DeadlineItem[] = []
let INIT_ERROR: unknown = null

try {
  const conferencesPath = path.join(process.cwd(), 'data', 'conferences.yml')
  const competitionsPath = path.join(process.cwd(), 'data', 'competitions.yml')
  const activitiesPath = path.join(process.cwd(), 'data', 'activities.yml')

  const conferencesData = yaml.parse(fs.readFileSync(conferencesPath, 'utf8')) as DeadlineItem[]
  const competitionsData = yaml.parse(fs.readFileSync(competitionsPath, 'utf8')) as DeadlineItem[]
  const activitiesData = yaml.parse(fs.readFileSync(activitiesPath, 'utf8')) as DeadlineItem[]

  STATIC_DATA = [...conferencesData, ...competitionsData, ...activitiesData]
} catch (err) {
  INIT_ERROR = err
}

export async function GET() {
  if (INIT_ERROR) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
  return NextResponse.json(STATIC_DATA)
}
