"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChatComponent } from "@/components/chat-component"
import { StreamPlayer } from "@/components/stream-player"
import { Heart, Share2, Users, MessageSquare, Info } from "lucide-react"

export default function StreamPage() {
  const { id } = useParams()
  const [stream, setStream] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response = await fetch(`/api/streams/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch stream")
        }
        const data = await response.json()
        setStream(data)
      } catch (err) {
        setError("Failed to load stream. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchStream()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full gradient-bg animate-pulse-slow"></div>
          <p className="text-muted-foreground">Loading stream...</p>
        </div>
      </div>
    )
  }

  if (error || !stream) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Info className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Stream Not Found</h2>
          <p className="text-muted-foreground">{error || "This stream may have ended or doesn't exist."}</p>
          <Button asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden">
            <StreamPlayer streamUrl={stream.playbackUrl} />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-red-600 hover:bg-red-700 text-white">
                  LIVE
                </Badge>
                <h1 className="text-2xl font-bold">{stream.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Follow</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={stream.creator.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{stream.creator.username.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{stream.creator.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    <Users className="h-3 w-3 inline mr-1" />
                    {stream.viewers.toLocaleString()} viewers
                  </p>
                </div>
              </div>
              <Button>Subscribe</Button>
            </div>
          </div>

          <Tabs defaultValue="about" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4">
              <Card className="p-4">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{stream.description}</p>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2 mb-4">
                  <h3 className="font-medium w-full mb-2">Tags</h3>
                  {stream.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="font-medium mb-2">Stream Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Category</div>
                    <div>{stream.category}</div>
                    <div className="text-muted-foreground">Started</div>
                    <div>{new Date(stream.startedAt).toLocaleString()}</div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="schedule">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Upcoming Streams</h3>
                <div className="text-center py-8 text-muted-foreground">No scheduled streams available</div>
              </Card>
            </TabsContent>
            <TabsContent value="videos">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Past Broadcasts</h3>
                <div className="text-center py-8 text-muted-foreground">No past broadcasts available</div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <h3 className="font-medium">Live Chat</h3>
              </div>
              <Badge variant="outline" className="bg-muted/50">
                {stream.viewers.toLocaleString()} chatting
              </Badge>
            </div>
            <ChatComponent streamId={stream.id} />
          </Card>
        </div>
      </div>
    </div>
  )
}
