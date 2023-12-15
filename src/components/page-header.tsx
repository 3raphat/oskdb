import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
}

export function PageHeader({
  heading,
  text,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <>
      <div className={cn("mb-8 grid space-y-4", className)} {...props}>
        <h1 className="text-4xl font-semibold lg:text-5xl">{heading}</h1>
        {text && (
          <Balancer className="text-xl text-muted-foreground">{text}</Balancer>
        )}
      </div>
    </>
  )
}
