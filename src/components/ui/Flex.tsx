import { CSSProperties, FC, ReactNode } from "react"

interface FlexProps extends CSSProperties {
  className?: string
  children: ReactNode
}

const Flex: FC<FlexProps> = ({ children, className, ...props }) => {
  return (
    <div className={className} style={{ display: "flex", ...props }}>
      {children}
    </div>
  )
}

export { Flex }
