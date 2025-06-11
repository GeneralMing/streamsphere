import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function Categories() {
  const categories = [
    { name: "Technology", icon: "💻", color: "bg-blue-500" },
    { name: "Programming", icon: "👨‍💻", color: "bg-green-500" },
    { name: "DevOps", icon: "🔄", color: "bg-orange-500" },
    { name: "Databases", icon: "🗄️", color: "bg-red-500" },
    { name: "Cloud", icon: "☁️", color: "bg-purple-500" },
    { name: "Security", icon: "🔒", color: "bg-yellow-500" },
    { name: "AI & ML", icon: "🤖", color: "bg-pink-500" },
    { name: "Blockchain", icon: "⛓️", color: "bg-indigo-500" },
    { name: "Mobile Dev", icon: "📱", color: "bg-teal-500" },
    { name: "IoT", icon: "🔌", color: "bg-cyan-500" },
  ]

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Popular Categories</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-4 p-1">
          {categories.map((category) => (
            <div
              key={category.name}
              className="w-[180px] cursor-pointer rounded-lg overflow-hidden transition-transform hover:-translate-y-1"
            >
              <div className={`h-24 flex items-center justify-center ${category.color}`}>
                <span className="text-4xl">{category.icon}</span>
              </div>
              <div className="p-3 bg-card border-x border-b rounded-b-lg">
                <h3 className="font-medium text-center">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
