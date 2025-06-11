import { NextResponse } from "next/server"

// Mock data for streams
const streams = [
  {
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
  },
  {
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
  },
  {
    id: "stream-3",
    title: "Kubernetes Deep Dive",
    description:
      "Explore advanced Kubernetes concepts including custom controllers, operators, and multi-cluster management.",
    creator: {
      id: "user-3",
      username: "CloudNative",
      avatar: "/placeholder.svg?height=40&width=40&text=CN",
    },
    category: "DevOps",
    viewers: 2134,
    thumbnail: "/placeholder.svg?height=400&width=600&text=K8s",
    startedAt: new Date(Date.now() - 5400000).toISOString(),
    tags: ["kubernetes", "devops", "cloud", "containers"],
  },
]

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  // Filter streams by category if provided
  let filteredStreams = streams
  if (category) {
    filteredStreams = streams.filter((stream) => stream.category.toLowerCase() === category.toLowerCase())
  }

  // Limit the number of streams returned
  const limitedStreams = filteredStreams.slice(0, limit)

  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200))

  return NextResponse.json({
    streams: limitedStreams,
    total: filteredStreams.length,
    page: 1,
    limit,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, you would save to a database
    // and handle authentication/authorization

    const newStream = {
      id: `stream-${Date.now()}`,
      title: body.title,
      description: body.description,
      creator: {
        id: "user-current", // Would come from authenticated user
        username: "CurrentUser",
        avatar: "/placeholder.svg?height=40&width=40&text=CU",
      },
      category: body.category,
      viewers: 0,
      thumbnail: body.thumbnail || "/placeholder.svg?height=400&width=600&text=New",
      startedAt: new Date().toISOString(),
      tags: body.tags || [],
    }

    // In a real app, we would add to database
    // streams.push(newStream);

    return NextResponse.json(newStream, { status: 201 })
  } catch (error) {
    console.error("Error creating stream:", error)
    return NextResponse.json({ error: "Failed to create stream" }, { status: 500 })
  }
}
