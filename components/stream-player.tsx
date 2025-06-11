"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface StreamPlayerProps {
  streamUrl: string
}

export function StreamPlayer({ streamUrl }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [quality, setQuality] = useState("auto")
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // For demo purposes, we'll use a placeholder video
  const demoVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const toggleFullscreen = () => {
    const container = document.querySelector(".player-container")
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  const handleMouseMove = () => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div
      className="player-container relative aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        src={demoVideoUrl} // Using demo video for preview
        poster="/placeholder.svg?height=720&width=1280&text=StreamSphere"
        onClick={togglePlay}
      />

      {/* Overlay for play/pause on click */}
      <div className="absolute inset-0 bg-transparent" onClick={togglePlay}></div>

      {/* Play/Pause large button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-20 w-20 rounded-full bg-black/50 text-white hover:bg-black/70 hover:scale-105 transition-all"
            onClick={togglePlay}
          >
            <Play className="h-10 w-10" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress bar */}
        <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="mb-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            <span className="text-xs text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Quality</h4>
                  <div className="space-y-1">
                    {["auto", "1080p", "720p", "480p", "360p"].map((q) => (
                      <Button
                        key={q}
                        variant={quality === q ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setQuality(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" className="text-white" onClick={toggleFullscreen}>
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
