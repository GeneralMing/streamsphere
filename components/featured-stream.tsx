import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FeaturedStream() {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.svg?height=800&width=1600')" }}
      ></div>
      <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="border-2 border-background w-8 h-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                <AvatarFallback>{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-white/80">12.4k watching</span>
          <Badge variant="secondary" className="bg-red-600 hover:bg-red-700 text-white">
            LIVE
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Global Gaming Championship Finals</h1>
        <p className="text-white/80 max-w-2xl mb-6">
          Watch the most anticipated esports event of the year as top teams battle for the championship title and a $2
          million prize pool.
        </p>
        <div className="flex gap-4">
          <Button className="gap-2">
            <Play className="h-4 w-4" />
            Watch Now
          </Button>
          <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
