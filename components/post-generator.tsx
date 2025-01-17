"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PostGenerator() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [imageOption, setImageOption] = useState('ai')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl, imageOption }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      toast({
        title: "Post created",
        description: "Your post has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="youtube-url">YouTube URL</Label>
            <Input
              id="youtube-url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>
          <div>
            <Label>Image Option</Label>
            <RadioGroup value={imageOption} onValueChange={setImageOption} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ai" id="ai" />
                <Label htmlFor="ai">AI-generated image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom image</Label>
              </div>
            </RadioGroup>
          </div>
          {imageOption === 'custom' && (
            <div>
              <Label htmlFor="custom-image">Custom Image</Label>
              <Input id="custom-image" type="file" accept="image/*" />
            </div>
          )}
          <Button type="submit" className="w-full">Generate Posts</Button>
        </form>
      </CardContent>
    </Card>
  )
}

