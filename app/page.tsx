import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PostGenerator } from '@/components/post-generator'
import PostList from '@/components/post-list'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary">Social Media Post Generator</h1>
      <PostGenerator />
      <PostList />
    </main>
  )
}

