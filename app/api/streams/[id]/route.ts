import { NextResponse } from "next/server"

// Mock data for a specific stream
const getStreamById = (id: string) => {
  const streamData = {
    "stream-1": {
      id: "stream-1",
      title: "Building a Microservices Architecture",
      description: "Learn how to design and implement a scalable microservices architecture using Node.js and Docker.",
      creator: {
        id: "user-1",
        username: "TechArchitect",
        avatar: "/placeholder.svg?height=40&width=40&text=TA",
      },
      category: "Tech",
      viewers: 1245,
      thumbnail: "/placeholder.svg?height=400&width=600&text=Tech",
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      tags: ["microservices", "node.js", "docker", "architecture"],
      status: "live",
      rtmpUrl: "rtmp://streaming.streamsphere.com/live/stream-1",
      playbackUrl: "https://streaming.streamsphere.com/hls/stream-1/index.m3u8",
      chat: {
        enabled: true,
        moderators: ["user-1", "user-admin"],
      },
    },
    "stream-2": {
      id: "stream-2",
      title: "Advanced React Patterns Workshop",
      description:
        "Deep dive into advanced React patterns including compound components, render props, and custom hooks.",
      creator: {
        id: "user-2",
        username: "ReactMaster",
        avatar: "/placeholder.svg?height=40&width=40&text=RM",
      },
      category: "Programming",
      viewers: 876,
      thumbnail: "/placeholder.svg?height=400&width=600&text=React",
      startedAt: new Date(Date.now() - 7200000).toISOString(),
      tags: ["react", "javascript", "frontend", "patterns"],
      status: "live",
      rtmpUrl: "rtmp://streaming.streamsphere.com/live/stream-2",
      playbackUrl: "https://streaming.streamsphere.com/hls/stream-2/index.m3u8",
      chat: {
        enabled: true,
        moderators: ["user-2", "user-admin"],
      },
    },
  }

  return streamData[id as keyof typeof streamData]
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const stream = getStreamById(id)

  if (!stream) {
    return NextResponse.json({ error: "Stream not found" }, { status: 404 })
  }

  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 100))

  return NextResponse.json(stream)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const stream = getStreamById(id)

    if (!stream) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 })
    }

    const body = await request.json()

    // In a real application, you would update the database
    // and handle authentication/authorization

    const updatedStream = {
      ...stream,
      ...body,
      // Don't allow updating certain fields
      id: stream.id,
      creator: stream.creator,
      startedAt: stream.startedAt,
    }

    return NextResponse.json(updatedStream)
  } catch (error) {
    console.error("Error updating stream:", error)
    return NextResponse.json({ error: "Failed to update stream" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const stream = getStreamById(id)

  if (!stream) {
    return NextResponse.json({ error: "Stream not found" }, { status: 404 })
  }

  // In a real application, you would delete from the database
  // and handle authentication/authorization

  return NextResponse.json({ message: "Stream deleted successfully" }, { status: 200 })
}
