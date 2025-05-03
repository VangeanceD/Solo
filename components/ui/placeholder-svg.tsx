"use client"

import { useId } from "react"

interface PlaceholderSvgProps {
  width?: number
  height?: number
  text?: string
  bgColor?: string
  textColor?: string
  className?: string
}

export function PlaceholderSvg({
  width = 128,
  height = 128,
  text = "",
  bgColor = "#00a8ff20",
  textColor = "#00a8ff",
  className = "",
}: PlaceholderSvgProps) {
  const id = useId()
  const displayText = text || "?"

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width={width} height={height} fill={bgColor} />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={textColor}
        fontSize={width > 64 ? "32px" : "16px"}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {displayText}
      </text>
    </svg>
  )
}
