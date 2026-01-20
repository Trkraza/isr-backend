import { NextResponse } from 'next/server'
import { getStats } from '@/lib/kv'

// ====================
// GET /api/stats
// ====================
// Get platform statistics
export async function GET() {
  try {
    const stats = await getStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('GET /api/stats error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
        stats: {
          totalApps: 0,
          totalChains: 0,
          totalCategories: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
      { status: 500 }
    )
  }
}