"use client"

import { useEffect, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FastForward, Pause, Play, Rewind, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Share_Tech_Mono } from "next/font/google"

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  audioUrl: string
}

const techFont = Share_Tech_Mono({ 
  weight: "400",
  subsets: ["latin"],
})

export default function MusicPlayer() {
  // State
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [volume, setVolume] = useState(80)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Refs to store current state values for the visualizer
  const currentTimeRef = useRef(currentTime)
  const durationRef = useRef(duration)
  const isPlayingRef = useRef(isPlaying)
  const currentTrackRef = useRef(currentTrack)

  // Update refs when state changes
  useEffect(() => {
    currentTimeRef.current = currentTime
  }, [currentTime])

  useEffect(() => {
    durationRef.current = duration
  }, [duration])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    currentTrackRef.current = currentTrack
  }, [currentTrack])

  // Sample tracks
  const tracks: Track[] = [
    {
      id: 1,
      title: "Ambient Waves",
      artist: "Sonic Explorer",
      duration: "3:45",
      audioUrl:
        "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    },
    {
      id: 2,
      title: "Digital Dreams",
      artist: "Byte Composer",
      duration: "4:20",
      audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    },
    {
      id: 3,
      title: "Electronic Journey",
      artist: "Digital Nomad",
      duration: "4:10",
      audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
    },
    {
      id: 4,
      title: "Synthwave Dreams",
      artist: "Wave Rider",
      duration: "4:30",
      audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg",
    },
    {
      id: 7,
      title: "Neon Nights",
      artist: "Retro Wave",
      duration: "3:30",
      audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/ateapill.ogg",
    },
    {
      id: 8,
      title: "Future Funk",
      artist: "Synth Master",
      duration: "2:55",
      audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg",
    },
    {
      id: 9,
      title: "Digital Love 2.0",
      artist: "French House Collective",
      duration: "4:15",
      audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/GalaxyInvaders/theme_01.mp3",
    },
    {
      id: 10,
      title: "Robot Rock Redux",
      artist: "Electro Punk",
      duration: "3:45",
      audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3",
    }
  ]

  // Initialize with first track
  useEffect(() => {
    if (!currentTrack && tracks.length > 0) {
      setCurrentTrack(tracks[0])
    }
  }, [])

  // Advanced visualizer with vector animations
  const startVisualizer = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Animation parameters
    const barCount = 32
    const barWidth = width / barCount - 1
    const bars: number[] = Array(barCount).fill(0)

    // Vector animation parameters
    const wavePoints = 100
    const waveData: number[] = Array(wavePoints).fill(0)
    const circlePoints: { x: number; y: number; radius: number; color: string; speed: number }[] = []

    // Initialize circle points
    for (let i = 0; i < 5; i++) {
      const colors = ["#ff6b00", "#00c2ff", "#00ff9d", "#ffffff", "#ff6b00"]
      circlePoints.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 5 + 2,
        color: colors[i],
        speed: Math.random() * 2 + 0.5,
      })
    }

    // Time tracking for animations
    let time = 0

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      time += 0.01

      // Clear canvas - dark background like OP-1
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(0, 0, width, height)

      // Draw grid lines like OP-1
      ctx.strokeStyle = "#333333"
      ctx.lineWidth = 0.5

      // Horizontal grid lines
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Vertical grid lines
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }

      // Update bar heights with some randomness to simulate audio reactivity
      for (let i = 0; i < barCount; i++) {
        if (isPlayingRef.current) {
          // When playing, make the bars more dynamic
          const targetHeight = Math.random() * 50 + 10
          // Smooth transitions
          bars[i] = bars[i] * 0.9 + targetHeight * 0.1
        } else {
          // When paused, make the bars settle down
          bars[i] = bars[i] * 0.95
        }

        // Color based on position - use OP-1 colors
        let color
        if (i < barCount / 4) {
          color = "#ff6b00" // Orange
        } else if (i < barCount / 2) {
          color = "#00c2ff" // Blue
        } else if (i < (3 * barCount) / 4) {
          color = "#00ff9d" // Green
        } else {
          color = "#ffffff" // White
        }

        // Draw bar
        ctx.fillStyle = color
        ctx.fillRect(i * (barWidth + 1), height - bars[i], barWidth, bars[i])
      }

      // Draw oscilloscope-like waveform
      ctx.beginPath()
      ctx.strokeStyle = "#00ff9d" // Green
      ctx.lineWidth = 2

      // Update wave data
      for (let i = 0; i < wavePoints; i++) {
        // Create a more complex wave pattern
        const intensity = isPlayingRef.current ? 1 : 0.2
        waveData[i] =
          Math.sin(time * 3 + i * 0.2) * 15 * intensity +
          Math.sin(time * 5 + i * 0.3) * 5 * intensity +
          Math.sin(time * 7 + i * 0.5) * 3 * intensity
      }

      // Draw the wave
      for (let i = 0; i < wavePoints; i++) {
        const x = (width / wavePoints) * i
        const y = height / 2 + waveData[i]

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Draw circular vector elements
      circlePoints.forEach((point, index) => {
        // Update position
        if (isPlayingRef.current) {
          point.x += Math.sin(time * point.speed) * 2
          point.y += Math.cos(time * point.speed) * 2
        }

        // Keep within bounds
        if (point.x < 0 || point.x > width) point.x = width / 2
        if (point.y < 0 || point.y > height) point.y = height / 2

        // Draw circle
        ctx.beginPath()
        ctx.fillStyle = point.color
        ctx.arc(
          point.x,
          point.y,
          point.radius * (isPlayingRef.current ? 1 + Math.sin(time * 5) * 0.3 : 1),
          0,
          Math.PI * 2,
        )
        ctx.fill()

        // Draw connecting lines between circles
        if (index > 0) {
          const prevPoint = circlePoints[index - 1]
          ctx.beginPath()
          ctx.strokeStyle = point.color
          ctx.lineWidth = 1
          ctx.moveTo(prevPoint.x, prevPoint.y)
          ctx.lineTo(point.x, point.y)
          ctx.stroke()
        }
      })

      // Draw geometric shapes that react to the "beat"
      if (isPlayingRef.current) {
        // Draw a pulsing triangle
        const triangleSize = 20 + Math.sin(time * 8) * 10
        const triangleX = width - 50
        const triangleY = 50

        ctx.beginPath()
        ctx.fillStyle = "#ff6b00" // Orange
        ctx.moveTo(triangleX, triangleY - triangleSize)
        ctx.lineTo(triangleX - triangleSize, triangleY + triangleSize)
        ctx.lineTo(triangleX + triangleSize, triangleY + triangleSize)
        ctx.closePath()
        ctx.fill()

        // Draw a rotating square
        const squareSize = 15
        const squareX = 50
        const squareY = 50

        ctx.save()
        ctx.translate(squareX, squareY)
        ctx.rotate(time * 2)
        ctx.fillStyle = "#00c2ff" // Blue
        ctx.fillRect(-squareSize, -squareSize, squareSize * 2, squareSize * 2)
        ctx.restore()
      }

      // Draw time indicator - using the current values from refs
      const timeText = formatTime(currentTimeRef.current) + " / " + formatTime(durationRef.current)
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px monospace"
      ctx.fillText(timeText, 10, 15)

      // Draw track number indicator - using the current track from ref
      if (currentTrackRef.current) {
        const trackText = `TRACK ${currentTrackRef.current.id}/${tracks.length}`
        ctx.fillText(trackText, width - 70, 15)
      }

      // Draw playback indicator - using the current playing state from ref
      const playbackText = isPlayingRef.current ? "PLAYING" : "PAUSED"
      ctx.fillStyle = isPlayingRef.current ? "#00ff9d" : "#ff6b00"
      ctx.fillText(playbackText, width / 2 - 25, 15)
    }

    draw()
  }

  // Handle track changes
  useEffect(() => {
    if (currentTrack) {
      // Create a new audio element each time to avoid issues
      const audio = new Audio(currentTrack.audioUrl)

      // Set up event listeners
      audio.addEventListener("timeupdate", () => {
        if (!isDraggingProgress) {
          setCurrentTime(audio.currentTime)
          const newProgress = (audio.currentTime / audio.duration) * 100
          setProgress(isNaN(newProgress) ? 0 : newProgress)
        }
      })

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration)
        console.log("Audio loaded, duration:", audio.duration)
      })

      audio.addEventListener("ended", () => {
        handleNext()
      })

      audio.addEventListener("error", (e) => {
        console.error("Audio error:", e)
      })

      // Set volume
      audio.volume = volume / 100
      audio.muted = isMuted

      // Replace the current audio element
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = audio

      // Start playing if needed
      if (isPlaying) {
        audio
          .play()
          .then(() => {
            console.log("Audio playing successfully")
          })
          .catch((err) => {
            console.error("Error playing audio:", err)
            setIsPlaying(false)
          })
      }

      // Start visualizer if not already running
      if (!animationRef.current) {
        startVisualizer()
      }
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        // Remove event listeners
        audioRef.current.onended = null
        audioRef.current.ontimeupdate = null
        audioRef.current.onloadedmetadata = null
        audioRef.current.onerror = null
      }
    }
  }, [currentTrack])

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .then(() => {
            console.log("Audio playing successfully")
          })
          .catch((err) => {
            console.error("Error playing audio:", err)
            setIsPlaying(false)
          })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
      console.log("Volume set to:", volume / 100)
    }
  }, [volume])

  // Handle mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
      console.log("Muted set to:", isMuted)
    }
  }, [isMuted])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTrackSelect = (track: Track) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause if same track
      handlePlayPause()
    } else {
      // Change track and play
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const handleNext = () => {
    if (!currentTrack) return
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % tracks.length
    setCurrentTrack(tracks[nextIndex])
  }

  const handlePrevious = () => {
    if (!currentTrack) return
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length
    setCurrentTrack(tracks[prevIndex])
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    // Update mute state based on volume
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newProgress = value[0]
      setProgress(newProgress)

      const newTime = (newProgress / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-[#e6e6e6] rounded-lg overflow-hidden shadow-xl border border-gray-300">
      {/* Mobile horizontal volume slider - only shows on small screens */}
      <div className="sm:hidden p-3 pt-2 pb-2 bg-[#f5f5f5] flex items-center space-x-3 border-b border-gray-300">
        <div className="flex-1 px-1">
          <Slider
            orientation="horizontal"
            value={[isMuted ? 0 : volume]}
            max={100}
            step={10}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex-shrink-0 relative flex items-center justify-center h-8 w-14 bg-[#f0f0f0] rounded-lg shadow-md hover:shadow-lg transition-all active:translate-y-0.5 border border-gray-300"
        >
          <div className="absolute inset-x-2 inset-y-1 bg-gradient-to-b from-[#ff6b00] to-[#cc5500] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
          </div>
        </button>
      </div>
      {/* Top section with visualizer */}
      <div className="bg-[#1a1a1a] p-3 border-b border-gray-300">
        <canvas ref={canvasRef} width={400} height={120} className="w-full rounded-sm" />
      </div>

      {/* Main content wrapper with volume slider */}
      <div className="flex">
        {/* Main content area */}
        <div className="flex-1 p-3 space-y-2">
          {/* Main controls */}
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="flex-1 relative flex items-center justify-center h-14 w-14 bg-[#f0f0f0] rounded-lg shadow-md hover:shadow-lg transition-all active:translate-y-0.5 border border-gray-300"
            >
              <div className="absolute inset-2 bg-gradient-to-b from-white to-[#e6e6e6] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center">
                <SkipBack className="h-5 w-5 text-gray-700" />
              </div>
            </button>

            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
                }
              }}
              className="flex-1 relative flex items-center justify-center h-14 w-14 bg-[#f0f0f0] rounded-lg shadow-md hover:shadow-lg transition-all active:translate-y-0.5 border border-gray-300"
            >
              <div className="absolute inset-2 bg-gradient-to-b from-white to-[#e6e6e6] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center">
                <Rewind className="h-5 w-5 text-gray-700" />
              </div>
            </button>

            <button
              onClick={handlePlayPause}
              className="flex-1 relative flex items-center justify-center h-14 w-14 bg-[#f0f0f0] rounded-lg shadow-md hover:shadow-lg transition-all active:translate-y-0.5 border border-gray-300"
            >
              <div className={`absolute inset-2 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center ${
                isPlaying ? "bg-gradient-to-b from-[#ff6b00] to-[#cc5500]" : "bg-gradient-to-b from-[#00ff9d] to-[#00cc7a]"
              }`}>
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white" />
                )}
              </div>
            </button>

            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10)
                }
              }}
              className="flex-1 relative flex items-center justify-center h-14 w-14 bg-[#f0f0f0] rounded-lg shadow-md hover:shadow-lg transition-all active:translate-y-0.5 border border-gray-300"
            >
              <div className="absolute inset-2 bg-gradient-to-b from-white to-[#e6e6e6] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center">
                <FastForward className="h-5 w-5 text-gray-700" />
              </div>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 relative flex items-center justify-center h-14 w-14 bg-[#f0f0f0] rounded-lg shadow-md hover:shadow-lg transition-all active:translate-y-0.5 border border-gray-300"
            >
              <div className="absolute inset-2 bg-gradient-to-b from-white to-[#e6e6e6] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center">
                <SkipForward className="h-5 w-5 text-gray-700" />
              </div>
            </button>
          </div>

          {/* Track info */}
          <div className="w-full px-3 py-3 bg-[#f5f5f5] rounded-sm border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-bold truncate text-gray-900">{currentTrack?.title || "No track selected"}</h2>
                <p className="text-xs text-gray-600">{currentTrack?.artist || "Unknown artist"}</p>
              </div>
              <div className="text-xs font-mono bg-[#1a1a1a] text-white px-2 py-1 rounded-sm ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Interactive progress bar */}
            <div className="px-1 py-2">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleProgressChange}
                onValueCommit={() => setIsDraggingProgress(false)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Track list */}
          <div className="bg-[#f0f0f0] p-3 border border-gray-300 rounded-sm">
            <h3 className="text-xs font-medium mb-2 text-gray-500 uppercase tracking-wider">Tracks</h3>
            <ScrollArea className="h-[250px]">
              <div className="grid grid-cols-2 gap-2">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    className={`relative text-left px-3 py-2 rounded-md transition-all border ${
                      currentTrack?.id === track.id
                        ? "bg-[#00c2ff] text-white border-[#0099cc]"
                        : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    } shadow-sm hover:shadow-md active:translate-y-0.5`}
                    onClick={() => handleTrackSelect(track)}
                  >
                    <div className="flex flex-col relative pr-4">
                      <div className="font-medium text-sm truncate">{track.title}</div>
                      <div className="text-xs opacity-75 truncate">{track.artist}</div>
                      <div className={`absolute top-0.5 right-0 text-[10px] leading-[4px] ${techFont.className} ${
                        currentTrack?.id === track.id ? "text-white/80" : "text-gray-400/90"
                      }`}>
                        {String(track.id).padStart(2, '0')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Volume slider - vertical on the right - hidden on mobile */}
        <div className="hidden sm:flex min-w-[3.5rem] w-14 p-2 flex-col items-center bg-[#f5f5f5] border-l border-gray-300">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="relative flex items-center justify-center h-10 w-10 mb-3 bg-[#f0f0f0] rounded-lg shadow-md hover:shadow-lg transition-all active:translate-y-0.5 border border-gray-300"
          >
            <div className="absolute inset-2 bg-gradient-to-b from-[#ff6b00] to-[#cc5500] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center">
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </div>
          </button>
          <div className="flex-1 w-full flex items-center justify-center px-2 sm:px-4">
            <Slider
              orientation="vertical"
              value={[isMuted ? 0 : volume]}
              max={100}
              step={10}
              onValueChange={handleVolumeChange}
              className="h-[calc(100%-1rem)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

