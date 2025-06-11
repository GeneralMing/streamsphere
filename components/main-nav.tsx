import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function MainNav() {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
          <span className="sr-only">StreamSphere</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-white"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <span className="hidden font-bold sm:inline-block">StreamSphere</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/browse" className="transition-colors hover:text-primary">
          Browse
        </Link>
        <Link href="/following" className="transition-colors hover:text-primary">
          Following
        </Link>
        <Link href="/discover" className="transition-colors hover:text-primary">
          Discover
        </Link>
      </nav>
      <div className="relative w-full max-w-sm hidden md:flex">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search streams, creators, or categories..."
          className="w-full pl-8 bg-muted/50"
        />
      </div>
    </div>
  )
}
