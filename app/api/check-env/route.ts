import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    frontendUrl: process.env.FRONTEND_URL || 'not-set',
    revalidateSecret: process.env.REVALIDATE_SECRET ? 'set' : 'not-set',
  })
}
