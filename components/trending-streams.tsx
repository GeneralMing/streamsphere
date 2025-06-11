import { TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TrendingStreams() {
  const trendingStreams = [
    {
      id: 1,
      title: "Distributed Systems Design Workshop",
      creator: "SystemsArchitect",
      viewers: 3245,
      growth: "+42%",
      thumbnail: "/placeholder.svg?height=120&width=200&text=Systems",
    },
    {
      id: 2,
      title: "Optimizing Redis for High Performance",
      creator: "CacheExpert",
      viewers: 1876,
      growth: "+28%",
      thumbnail: "/placeholder.svg?height=120&width=200&text=Redis",
    },
    {
      id: 3,
      title: "GraphQL API Design Patterns",
      creator: "APIDesigner",
      viewers: 2134,
      growth: "+35%",
      thumbnail: "/placeholder.svg?height=120&width=200&text=GraphQL",
    },
  ]

  return (
    <div className="mt-16 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
        </div>
        <Button variant="ghost" className="gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingStreams.map((stream) => (
          <div key={stream.id} className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <img
              src={stream.thumbnail || "/placeholder.svg"}
              alt={stream.title}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-medium line-clamp-2">{stream.title}</h3>
                <p className="text-sm text-muted-foreground">{stream.creator}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{stream.viewers.toLocaleString()} viewers</span>
                <span className="text-sm text-green-500 font-medium">{stream.growth}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
