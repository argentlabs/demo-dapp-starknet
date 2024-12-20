import { FC, PropsWithChildren, ReactNode } from "react"
import { IconStatusIcon } from "../icons/IconStatusIcon"

interface SectionLayoutProps extends PropsWithChildren {
  sectionTitle: string
  icon?: ReactNode
}

const SectionLayout: FC<SectionLayoutProps> = ({
  children,
  sectionTitle,
  icon,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full h-fit p-6 rounded-xl bg-black">
      <div className="flex pb-4 gap-2 relative border-solid border-b-[1px] border-raisin-black ">
        {icon ? icon : <IconStatusIcon />}
        <h3 className="text-lg font-semibold leading-6 text-left">
          {sectionTitle}
        </h3>
      </div>
      <div className="flex column gap-3">{children}</div>
    </div>
  )
}

export { SectionLayout }
