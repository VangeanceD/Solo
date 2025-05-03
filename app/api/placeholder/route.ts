import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const height = Number.parseInt(searchParams.get("height") || "128")
  const width = Number.parseInt(searchParams.get("width") || "128")
  const text = searchParams.get("text") || "?"

  // Create an SVG placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#00a8ff20"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#00a8ff" font-size="${width > 64 ? 32 : 16}px" font-weight="bold" font-family="system-ui, sans-serif">
        ${text}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
