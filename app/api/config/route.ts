import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const config = await prisma.socialMediaConfig.findUnique({
      where: { userId: user.id },
    })
    return NextResponse.json(config || {})
  } catch (error) {
    console.error('Failed to fetch configuration:', error)
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { facebookApiKey, instagramApiKey, linkedinApiKey } = await req.json()

    const config = await prisma.socialMediaConfig.upsert({
      where: { userId: user.id },
      update: { facebookApiKey, instagramApiKey, linkedinApiKey },
      create: {
        userId: user.id,
        facebookApiKey,
        instagramApiKey,
        linkedinApiKey,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to save configuration:', error)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}

