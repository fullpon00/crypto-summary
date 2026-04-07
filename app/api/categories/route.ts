import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const revalidate = 3600

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(categories)
}
