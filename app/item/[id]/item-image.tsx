"use client"

import { useState } from "react"

interface ItemImageProps {
  src: string
  alt: string
}

export function ItemImage({ src, alt }: ItemImageProps) {
  const [imageSrc, setImageSrc] = useState(src || "/placeholder.svg")

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className="w-full aspect-square object-cover"
        onError={() => {
          console.error("[v0] Image failed to load:", src)
          setImageSrc("/placeholder.svg")
        }}
      />
    </div>
  )
}
