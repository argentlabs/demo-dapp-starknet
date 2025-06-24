import { FC } from "react"

interface FileUploaderProps {
  id: string
  selectedFile: File | null
  title: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FileUploader: FC<FileUploaderProps> = ({
  id,
  selectedFile,
  title,
  onChange,
}) => (
  <div className="flex flex-col gap-3 justify-center">
    <label htmlFor={id} className="text-base font-medium leading-6">
      {title}
    </label>
    <div className="flex flex-1">
      <label
        htmlFor={id}
        className="flex flex-1 gap-2 cursor-pointer group bg-raisin-black rounded-lg p-1.5 items-center"
      >
        {selectedFile ? (
          <>
            <div className="px-4 py-2 bg-transparent text-white border border-white rounded-md">
              {selectedFile.name}
            </div>
            <div className="text-horizon-blue font-semibold leading-6">
              Change
            </div>
          </>
        ) : (
          <>
            <div className="px-4 py-2 bg-transparent text-horizon-blue border border-horizon-blue rounded-md cursor-pointer group-hover:bg-charcoal transition-colors">
              Choose file
            </div>
            <div className="flex items-center text-dark-grey group-hover:text-light-grey">
              No file choosen
            </div>
          </>
        )}
      </label>
      <input
        type="file"
        id={id}
        accept=".json"
        onChange={onChange}
        className="hidden" // Hide the actual input
      />
    </div>
  </div>
)

export { FileUploader }
