import { NextRequest, NextResponse } from 'next/server'
import { getAllDapps, getFeaturedDapps, upsertDapp } from '@/lib/kv'
import { generateSlug, validateDappData } from '@/lib/utils'
import { Dapp } from '@/lib/types'

// ====================
// GET /api/apps
// ====================
// Returns all dapps or filtered by featured
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    let apps: Dapp[]

    if (featured === 'true') {
      apps = await getFeaturedDapps()
    } else {
      apps = await getAllDapps()
    }

    return NextResponse.json({
      success: true,
      apps,
      total: apps.length,
    })
  } catch (error) {
    console.error('GET /api/apps error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch apps',
        apps: [],
      },
      { status: 500 }
    )
  }
}

// ====================
// POST /api/apps
// ====================
// Create or update a dapp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate data
    const validation = validateDappData(body)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    // Generate slug from name if not provided
    const slug = body.slug || generateSlug(body.name)

    // Prepare dapp data
    const now = new Date().toISOString()
    const dappData: Omit<Dapp, 'slug'> = {
      name: body.name.trim(),
      description: body.description.trim(),
      logo: body.logo.trim(),
      tags: body.tags,
      chains: body.chains,
      website: body.website.trim(),
      twitter: body.twitter?.trim() || undefined,
      github: body.github?.trim() || undefined,
      isFeatured: body.isFeatured || false,
      createdAt: body.createdAt || now,
      updatedAt: now,
    }

    // Save to database
    const success = await upsertDapp(slug, dappData)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save dapp',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Dapp saved successfully',
      slug,
    })
  } catch (error) {
    console.error('POST /api/apps error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}