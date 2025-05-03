import Image from "next/image"

interface FallbackImageProps {
  text: string
  width?: number
  height?: number
  className?: string
}

export function FallbackImage({ text, width = 128, height = 128, className = "" }: FallbackImageProps) {
  const placeholderUrl = `/api/placeholder?height=${height}&width=${width}&text=${encodeURIComponent(text)}`

  return (
    <Image src={placeholderUrl || "/placeholder.svg"} alt={text} width={width} height={height} className={className} />
  )
}
