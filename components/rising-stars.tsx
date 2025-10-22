"use client"

import { useRef, useEffect, useState } from "react"

interface Star {
  x: number
  y: number
  size: number
  speed: number
  brightness: number
  twinkleSpeed: number
  twinklePhase: number
  wobbleAmplitude: number
  wobbleFrequency: number
  wobbleOffset: number
  opacity: number
}

export default function RisingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateDimensions = () => {
      const { innerWidth, innerHeight } = window
      canvas.width = innerWidth
      canvas.height = innerHeight
      setDimensions({ width: innerWidth, height: innerHeight })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    // Function to calculate point on the blue curve
    const getPointOnCurve = (t: number, canvasWidth: number, canvasHeight: number) => {
      // Scale the curve coordinates to current canvas size
      const scaleX = canvasWidth / 1920
      const scaleY = canvasHeight / 1080

      // Original curve points: M -100 850 Q 960 620 2020 850
      const p0 = { x: -100 * scaleX, y: 850 * scaleY }
      const p1 = { x: 960 * scaleX, y: 620 * scaleY } // control point
      const p2 = { x: 2020 * scaleX, y: 850 * scaleY }

      // Quadratic bezier formula: P(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
      const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x
      const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y

      return { x, y }
    }

    // Create stars
    const stars: Star[] = []
    const createStar = () => {
      // Get a random point along the blue curve
      const t = Math.random() // 0 to 1 along the curve
      const curvePoint = getPointOnCurve(t, canvas.width, canvas.height)

      // Add slight random offset from the curve line
      const offsetY = Math.random() * 10 - 5 // ±5 pixels from curve

      return {
        x: curvePoint.x,
        y: curvePoint.y + offsetY,
        size: Math.random() * 0.8 + 0.3, // Very small: 0.3-1.1px
        speed: Math.random() * 0.15 + 0.05, // Very slow: 0.05-0.2px per frame
        brightness: Math.random() * 0.4 + 0.3, // Subtle: 0.3-0.7
        twinkleSpeed: Math.random() * 0.02 + 0.005, // Very slow twinkling
        twinklePhase: Math.random() * Math.PI * 2,
        wobbleAmplitude: Math.random() * 0.3 + 0.1, // Minimal wobble
        wobbleFrequency: Math.random() * 0.008 + 0.002, // Very slow wobble
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.6 + 0.2, // Dreamy opacity: 0.2-0.8
      }
    }

    // Initialize with fewer, more subtle stars
    for (let i = 0; i < 40; i++) {
      const star = createStar()
      // Distribute some stars already in the sky
      star.y = Math.random() * (canvas.height * 0.8) + canvas.height * 0.2
      stars.push(star)
    }

    // Animation loop
    let animationFrameId: number
    const animate = (time: number) => {
      // Clear with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new stars very occasionally
      if (Math.random() < 0.03) {
        // Much less frequent
        stars.push(createStar())
      }

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Update position - very slow upward movement
        star.y -= star.speed

        // Add very subtle horizontal wobble
        const wobble = Math.sin(time * star.wobbleFrequency + star.wobbleOffset) * star.wobbleAmplitude
        const displayX = star.x + wobble

        // Calculate subtle twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
        const brightness = star.brightness * twinkle * star.opacity

        // Draw very subtle, dust-like star
        ctx.save()
        ctx.globalAlpha = brightness

        // Soft, dreamy glow
        ctx.shadowColor = `rgba(255, 255, 255, ${brightness * 0.8})`
        ctx.shadowBlur = 2
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`

        // Draw as a tiny circle
        ctx.beginPath()
        ctx.arc(displayX, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()

        // Remove stars that have moved off screen
        if (star.y < -20) {
          stars.splice(i, 1)
          i--
        }
      }

      // Keep a modest number of stars
      while (stars.length < 30) {
        stars.push(createStar())
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", updateDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[15]"
      style={{
        opacity: 0.8, // Make the whole effect more subtle
        background: "transparent",
      }}
      aria-hidden="true"
    />
  )
}
