'use client'

import { Button } from "@/components/ui/button"

export default function TimeframeButtons() {
  return (
    <div className="flex justify-start gap-2 mb-4">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-[#1C1C1C] text-gray-300 border-gray-700 hover:bg-[#2D2D2D]"
      >
        1W
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="bg-[#1C1C1C] text-gray-300 border-gray-700 hover:bg-[#2D2D2D]"
      >
        1M
      </Button>
      <Button 
        size="sm"
        className="bg-[#9333EA] text-white hover:bg-[#7C2DC7]"
      >
        1Y
      </Button>
    </div>
  )
}

