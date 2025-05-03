"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface AvatarImageProps {
  src: string
  alt: string
  fallbackText: string
  width?: number
  height?: number
  className?: string
}

export function AvatarImage({ src, alt, fallbackText, width = 128, height = 128, className = "" }: AvatarImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Reset states when src changes
    setImgSrc(src)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleError = () => {
    setHasError(true)
    setImgSrc(`/api/placeholder?height=${width}&width=${height}&text=${encodeURIComponent(fallbackText)}`)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover ${hasError ? "bg-primary/20" : ""}`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  )
}
