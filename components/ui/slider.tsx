"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none",
      orientation === "horizontal" ? "flex-row w-full items-center" : "flex-col h-full items-center",
      className
    )}
    orientation={orientation}
    {...props}
  >
    <SliderPrimitive.Track 
      className={cn(
        "relative overflow-hidden rounded-full bg-slate-200",
        orientation === "horizontal" ? "h-2 w-full" : "h-full w-2"
      )}
    >
      <SliderPrimitive.Range className={cn(
        "absolute bg-primary",
        orientation === "horizontal" ? "h-full" : "w-full bottom-0"
      )} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn(
      "block bg-white border border-gray-300 shadow-md hover:shadow-lg transition-all active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      orientation === "horizontal" ? "h-4 w-6 rounded-sm" : "h-3 w-8 rounded-sm"
    )} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
