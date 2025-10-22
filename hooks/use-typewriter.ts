"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseTypewriterProps {
  text: string
  speed?: number
  shouldType?: boolean
  onComplete?: () => void
  onTextUpdate?: () => void
}

export function useTypewriter({ text, speed = 30, shouldType = false, onComplete, onTextUpdate }: UseTypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const indexRef = useRef(0)
  const isTypingRef = useRef(false)

  // Stable callback refs to prevent effect restarts
  const onCompleteRef = useRef(onComplete)
  const onTextUpdateRef = useRef(onTextUpdate)

  useEffect(() => {
    onCompleteRef.current = onComplete
    onTextUpdateRef.current = onTextUpdate
  })

  const startTyping = useCallback(() => {
    if (isTypingRef.current) return // Prevent multiple starts

    setDisplayedText("")
    setIsTyping(true)
    isTypingRef.current = true
    indexRef.current = 0

    const typeNextCharacter = () => {
      if (indexRef.current < text.length) {
        const newText = text.substring(0, indexRef.current + 1)
        setDisplayedText(newText)

        // Call onTextUpdate on every character to trigger scrolling
        onTextUpdateRef.current?.()

        indexRef.current++
        timerRef.current = setTimeout(typeNextCharacter, speed)
      } else {
        // Typing complete
        setIsTyping(false)
        isTypingRef.current = false
        onCompleteRef.current?.()
      }
    }

    typeNextCharacter()
  }, [text, speed])

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!shouldType) {
      setDisplayedText(text)
      setIsTyping(false)
      isTypingRef.current = false
      return
    }

    // Small delay to ensure clean start
    const startTimer = setTimeout(() => {
      startTyping()
    }, 50)

    return () => {
      clearTimeout(startTimer)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      isTypingRef.current = false
    }
  }, [text, shouldType, startTyping])

  return { displayedText, isTyping }
}
