import { NextRequest, NextResponse } from 'next/server'
import { getDappBySlug, deleteDapp } from '@/lib/kv'

// ====================
// GET /api/apps/[slug]
// ====================
// Get a single dapp by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const app = await getDappBySlug(slug)

    if (!app) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dapp not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      app,
    })
  } catch (error) {
    console.error(`GET /api/apps/[slug] error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dapp',
      },
      { status: 500 }
    )
  }
}

// ====================
// DELETE /api/apps/[slug]
// ====================
// Delete a dapp
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const success = await deleteDapp(slug)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete dapp',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Dapp deleted successfully',
    })
  } catch (error) {
    console.error(`DELETE /api/apps/[slug] error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}