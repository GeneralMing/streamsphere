import { Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function StreamGrid() {
  const streams = [
    {
      id: 1,
      title: "Building a Microservices Architecture",
      creator: "TechArchitect",
      category: "Tech",
      viewers: 1245,
      thumbnail: "/placeholder.svg?height=400&width=600&text=Tech",
      avatar: "/placeholder.svg?height=40&width=40&text=TA",
    },
    {
      id: 2,
      title: "Advanced React Patterns Workshop",
      creator: "ReactMaster",
      category: "Programming",
      viewers: 876,
      thumbnail: "/placeholder.svg?height=400&width=600&text=React",
      avatar: "/placeholder.svg?height=40&width=40&text=RM",
    },
    {
      id: 3,
      title: "Kubernetes Deep Dive",
      creator: "CloudNative",
      category: "DevOps",
      viewers: 2134,
      thumbnail: "/placeholder.svg?height=400&width=600&text=K8s",
      avatar: "/placeholder.svg?height=40&width=40&text=CN",
    },
    {
      id: 4,
      title: "Scaling PostgreSQL for High Traffic",
      creator: "DBGuru",
      category: "Databases",
      viewers: 543,
      thumbnail: "/placeholder.svg?height=400&width=600&text=SQL",
      avatar: "/placeholder.svg?height=40&width=40&text=DB",
    },
    {
      id: 5,
      title: "Real-time Analytics with Kafka",
      creator: "DataStreamer",
      category: "Big Data",
      viewers: 987,
      thumbnail: "/placeholder.svg?height=400&width=600&text=Kafka",
      avatar: "/placeholder.svg?height=40&width=40&text=DS",
    },
    {
      id: 6,
      title: "WebSocket Performance Optimization",
      creator: "RealTimeExpert",
      category: "Web Development",
      viewers: 765,
      thumbnail: "/placeholder.svg?height=400&width=600&text=WebSockets",
      avatar: "/placeholder.svg?height=40&width=40&text=RT",
    },
  ]

  return (
    <div className="stream-grid">
      {streams.map((stream) => (
        <div key={stream.id} className="stream-card group relative overflow-hidden rounded-lg border bg-card">
          <div className="live-indicator">LIVE</div>
          <div className="aspect-video overflow-hidden">
            <img
              src={stream.thumbnail || "/placeholder.svg"}
              alt={stream.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="viewer-count">
              <Eye className="h-3 w-3" />
              <span>{stream.viewers.toLocaleString()}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={stream.avatar || "/placeholder.svg"} />
                <AvatarFallback>{stream.creator.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium line-clamp-1">{stream.title}</h3>
                <p className="text-sm text-muted-foreground">{stream.creator}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-muted/50">
              {stream.category}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
