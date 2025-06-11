import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { StreamGrid } from "@/components/stream-grid"
import { FeaturedStream } from "@/components/featured-stream"
import { Categories } from "@/components/categories"
import { TrendingStreams } from "@/components/trending-streams"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline">Go Live</Button>
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <FeaturedStream />
          <Categories />
          <h2 className="text-3xl font-bold tracking-tight mt-12 mb-6">Live Now</h2>
          <StreamGrid />
          <TrendingStreams />
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StreamSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
