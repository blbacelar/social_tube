import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const { status, description } = await req.json()

    const updatedPost = await prisma.post.updateMany({
      where: { id, userId: user.id },
      data: { status, description },
    })

    if (updatedPost.count === 0) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Failed to update post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

