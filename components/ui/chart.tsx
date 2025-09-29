"use client"

import * as React from "react"

const ChartTooltipContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

export const ChartTooltipProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)

  return <ChartTooltipContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</ChartTooltipContext.Provider>
}

export const useChartTooltip = () => {
  const context = React.useContext(ChartTooltipContext)

  if (!context) {
    throw new Error("useChartTooltip must be used within a ChartTooltipProvider")
  }

  return context
}

export const ChartContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="relative">{children}</div>
}

export const ChartTooltip = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { open } = useChartTooltip()

  return open ? (
    <div className="pointer-events-none absolute z-50 rounded-md border bg-popover p-2 text-sm shadow-sm">
      {children}
    </div>
  ) : null
}

export const ChartTooltipContent = ({
  content,
}: {
  content: ({ payload }: { payload: any }) => React.ReactNode
}) => {
  const { onOpenChange } = useChartTooltip()

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-full top-0 left-1/2"
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
    >
      content()
    </div>
  )
}

