"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

type Post = {
  id: string
  description: string
  imageUrl: string
  status: string
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve post')
      }

      toast({
        title: "Post approved",
        description: "The post has been approved successfully.",
      })
      fetchPosts()
    } catch (error) {
      console.error('Error approving post:', error)
      toast({
        title: "Error",
        description: "Failed to approve post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject post')
      }

      toast({
        title: "Post rejected",
        description: "The post has been rejected successfully.",
      })
      fetchPosts()
    } catch (error) {
      console.error('Error rejecting post:', error)
      toast({
        title: "Error",
        description: "Failed to reject post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (id: string, newDescription: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: newDescription }),
      })

      if (!response.ok) {
        throw new Error('Failed to edit post')
      }

      toast({
        title: "Post updated",
        description: "The post has been updated successfully.",
      })
      fetchPosts()
    } catch (error) {
      console.error('Error editing post:', error)
      toast({
        title: "Error",
        description: "Failed to edit post. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center">Generated Posts</h2>
      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No posts generated yet. Use the form above to create new posts.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>Post {post.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={post.imageUrl || "/placeholder.svg"} alt="Post image" className="w-full h-48 object-cover mb-4 rounded-md" />
                <Textarea
                  value={post.description}
                  onChange={(e) => handleEdit(post.id, e.target.value)}
                  className="mb-4"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleApprove(post.id)} variant="default" disabled={post.status === 'approved'}>
                  {post.status === 'approved' ? 'Approved' : 'Approve'}
                </Button>
                <Button onClick={() => handleReject(post.id)} variant="destructive" disabled={post.status === 'rejected'}>
                  {post.status === 'rejected' ? 'Rejected' : 'Reject'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default PostList

