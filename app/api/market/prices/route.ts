import { NextResponse } from 'next/server'
import { getTopPrices } from '@/lib/market/coingecko'

export const revalidate = 300

export async function GET() {
  const prices = await getTopPrices()
  return NextResponse.json(prices)
}
