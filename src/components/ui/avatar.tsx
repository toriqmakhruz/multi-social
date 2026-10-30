import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
}

function Avatar({ src, alt, fallback, size = "md", className, ...props }: AvatarProps) {
  const [error, setError] = React.useState(false)

  if (src && !error) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden rounded-full", sizeClasses[size], className)} {...props}>
        <img
          src={src}
          alt={alt || ""}
          className="aspect-square h-full w-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
    </div>
  )
}

export { Avatar }
