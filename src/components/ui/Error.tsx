import { FC, PropsWithChildren } from "react"

export const ErrorText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col gap-2 w-full p-4 border border-solid border-raisin-black rounded-lg shadow-md">
      <span className="text-md font-semibold text-[#D42E68]">Error</span>
      <span className="text-sm text-[#D42E68] ">{children}</span>
    </div>
  )
}
