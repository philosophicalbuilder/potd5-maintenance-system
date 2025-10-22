"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

export function useAutoResizeTextarea({ minHeight, maxHeight = 300 }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = `${minHeight}px`
        return
      }

      // Reset height to get accurate scrollHeight
      textarea.style.height = `${minHeight}px`

      // Calculate new height based on content
      const scrollHeight = textarea.scrollHeight
      const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight))

      textarea.style.height = `${newHeight}px`

      // If content exceeds maxHeight, enable scrolling
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = "auto"
      } else {
        textarea.style.overflowY = "hidden"
      }
    },
    [minHeight, maxHeight],
  )

  useEffect(() => {
    // Set initial height and properties
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = `${minHeight}px`
      textarea.style.overflowY = "hidden"
      textarea.style.resize = "none"
    }
  }, [minHeight])

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [adjustHeight])

  return { textareaRef, adjustHeight }
}
