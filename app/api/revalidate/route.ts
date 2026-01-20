
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { type, value } = await request.json()

  if (!type || !value || (type !== 'path' && type !== 'tag')) {
    return NextResponse.json({ success: false, message: 'Invalid revalidation type or value' }, { status: 400 })
  }

  try {
    const frontendUrl = process.env.FRONTEND_URL
    const secret = process.env.REVALIDATE_SECRET

    if (!frontendUrl || !secret) {
      return NextResponse.json({ success: false, message: 'Application is not configured for revalidation.' }, { status: 500 })
    }

    const endpoint = type === 'path' ? '/api/revalidate-path' : '/api/revalidate-tag'
    const url = `${frontendUrl}${endpoint}`


    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [type]: value,
        secret,
      }),
    })

    const responseBody = await res.json();

    if (!res.ok) {
      return NextResponse.json({ success: false, message: responseBody.message || 'Revalidation failed on frontend' }, { status: res.status })
    }

    return NextResponse.json({ success: true, message: responseBody.message || 'Revalidation triggered' })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
