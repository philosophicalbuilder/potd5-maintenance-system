"use client"

import { useRef, useEffect, useState } from "react"

export default function ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
      sparkle: number
      opacity: number
      brightness: number
    }[] = []

    let textImageData: ImageData | null = null
    let animationTime = 0

    function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = "white"
      ctx.save()

      const horizonSize = isMobile ? 80 : 140

      // Create HORIZON text with particles
      ctx.font = `bold ${horizonSize}px Arial`
      ctx.textAlign = "center"
      ctx.fillText("HORIZON", canvas.width / 2, canvas.height / 2 - 50)

      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return 1
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data
      const particleGap = 2.5 // Spacing between particles

      for (let attempt = 0; attempt < 500; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          // Check if there's enough space around this position
          let hasSpace = true
          for (const particle of particles) {
            const dx = particle.baseX - x
            const dy = particle.baseY - y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < particleGap) {
              hasSpace = false
              break
            }
          }

          if (hasSpace) {
            return {
              x: x,
              y: y,
              baseX: x,
              baseY: y,
              size: Math.random() * 2 + 1.5, // Slightly larger particles
              color: "white",
              scatteredColor: "#00DCFF",
              life: Math.random() * 300 + 300,
              sparkle: Math.random() * Math.PI * 2,
              opacity: Math.random() * 0.3 + 0.9, // Higher base opacity
              brightness: Math.random() * 0.3 + 0.9, // Higher brightness
            }
          }
        }
      }
      return null
    }

    function createInitialParticles(scale: number) {
      const particleCount = isMobile ? 8000 : 12000

      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return

      animationTime++

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 150

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Enhanced sparkle animation
        p.sparkle += 0.08
        const sparkleIntensity = Math.sin(p.sparkle) * 0.3 + 0.9
        p.opacity = p.brightness * sparkleIntensity

        if (distance < maxDistance && (isTouchingRef.current || !("ontouchstart" in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 40
          const moveY = Math.sin(angle) * force * 40

          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.08
          p.y += (p.baseY - p.y) * 0.08
          // Bright white particles
          const brightness = Math.floor(255 * p.opacity)
          ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`
        }

        // Draw particles as small circles for better particle effect
        ctx.save()
        ctx.globalAlpha = Math.min(p.opacity, 1)

        // Add subtle glow
        if (p.opacity > 0.8) {
          ctx.shadowColor = "white"
          ctx.shadowBlur = 3
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
        ctx.restore()

        // Particle lifecycle management
        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            p.life = Math.random() * 300 + 300
            p.x = p.baseX
            p.y = p.baseY
            p.sparkle = Math.random() * Math.PI * 2
            p.brightness = Math.random() * 0.3 + 0.9
          }
        }
      }

      // Maintain target particle count
      const baseParticleCount = isMobile ? 8000 : 12000
      while (particles.length < baseParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) {
          particles.push(newParticle)
        } else {
          break
        }
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      const newScale = createTextImage()
      particles = []
      createInitialParticles(newScale)
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      handleMove(e.clientX - rect.left, e.clientY - rect.top)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        const rect = canvas.getBoundingClientRect()
        handleMove(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="Interactive particle effect with Horizon text"
      />
    </div>
  )
}
