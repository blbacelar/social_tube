"use client";

import { useState } from "react";
import { Facebook, Instagram, Linkedin, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for generated posts
const mockPosts = [
  {
    id: "1",
    platform: "instagram",
    youtubeUrl: "https://youtube.com/watch?v=123",
    description:
      "🎥 Check out our latest video! We dive deep into exciting topics. #ContentCreation #Instagram",
    imageUrl: "https://picsum.photos/400/400",
    status: "pending",
  },
  {
    id: "2",
    platform: "facebook",
    youtubeUrl: "https://youtube.com/watch?v=123",
    description:
      "📺 New video alert! Watch our comprehensive guide on the latest trends. Share with your friends who might find this helpful! #Learning #Facebook",
    imageUrl: "https://picsum.photos/400/400",
    status: "pending",
  },
  {
    id: "3",
    platform: "linkedin",
    youtubeUrl: "https://youtube.com/watch?v=123",
    description:
      "🎯 Professional insights: Our newest video explores industry best practices. Connect with us to stay updated on the latest content. #ProfessionalDevelopment #LinkedIn",
    imageUrl: "https://picsum.photos/400/400",
    status: "pending",
  },
];

export function PostGenerator() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imageOption, setImageOption] = useState("ai");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<typeof mockPosts>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Set the mock posts
      setGeneratedPosts(mockPosts);

      toast({
        title: "Posts generated",
        description: "Your posts have been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setYoutubeUrl("");
    }
  };

  const handleApprove = (postId: string) => {
    toast({
      title: "Post Approved",
      description: "The post will be published to the platform.",
    });
  };

  const handleReject = (postId: string) => {
    toast({
      title: "Post Rejected",
      description: "The post has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8">
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
                disabled={isGenerating}
              />
            </div>
            <div>
              <Label>Image Option</Label>
              <RadioGroup
                value={imageOption}
                onValueChange={setImageOption}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ai" id="ai" disabled={isGenerating} />
                  <Label htmlFor="ai">AI-generated image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="custom"
                    id="custom"
                    disabled={isGenerating}
                  />
                  <Label htmlFor="custom">Custom image</Label>
                </div>
              </RadioGroup>
            </div>
            {imageOption === "custom" && (
              <div>
                <Label htmlFor="custom-image">Custom Image</Label>
                <Input
                  id="custom-image"
                  type="file"
                  accept="image/*"
                  disabled={isGenerating}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Posts...
                </>
              ) : (
                "Generate Posts"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Display generated posts */}
      {generatedPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {generatedPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              <CardHeader className="flex flex-row items-center space-x-2 border-b">
                {post.platform === "instagram" && (
                  <Instagram className="h-5 w-5 text-pink-500" />
                )}
                {post.platform === "facebook" && (
                  <Facebook className="h-5 w-5 text-blue-600" />
                )}
                {post.platform === "linkedin" && (
                  <Linkedin className="h-5 w-5 text-blue-700" />
                )}
                <CardTitle className="text-lg text-black">
                  {post.platform.charAt(0).toUpperCase() +
                    post.platform.slice(1)}{" "}
                  Post
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1">
                <div className="space-y-4">
                  <img
                    src={post.imageUrl}
                    alt={`Generated ${post.platform} post`}
                    className="w-full h-48 object-cover rounded-lg shadow"
                  />
                  <p className="text-sm text-gray-600">{post.description}</p>
                </div>
              </CardContent>
              <div className="px-4 py-3 bg-gray-50 border-t flex justify-end space-x-2 mt-auto">
                <Button
                  onClick={() => handleReject(post.id)}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(post.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
