import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const height = searchParams.get("height") || "128"
  const width = searchParams.get("width") || "128"
  const text = searchParams.get("text") || "?"

  // Fix the JSX syntax error by properly formatting the style object
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        fontSize: Number.parseInt(width) > 64 ? "32px" : "16px",
        color: "#00a8ff",
        background: "#00a8ff20",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      }}
    >
      {text}
    </div>,
    {
      width: Number.parseInt(width),
      height: Number.parseInt(height),
    },
  )
}
