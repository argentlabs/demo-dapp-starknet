import React, { FC, useEffect, useState } from "react"
import { AccordionItem } from "./AccordionItem"

interface AccordionProps {
  withBorder?: boolean
  isDefaultOpen?: boolean
  items?: {
    title: string
    content: React.ReactNode
  }[]
}

const styles = {
  container: {
    border: "1px solid #C8C8C8",
    borderRadius: "8px",
  },
}

const Accordion: FC<AccordionProps> = ({
  items = [],
  withBorder,
  isDefaultOpen,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([])

  const accordionItems = items.length > 0 ? items : []

  const handleClick = (index: number) => {
    setOpenIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        // If already open, close it
        return prevIndices.filter((i) => i !== index)
      } else {
        // If closed, add it to open indices
        return [...prevIndices, index]
      }
    })
  }

  useEffect(() => {
    if (isDefaultOpen) {
      setOpenIndices([0])
    }
  }, [])

  return (
    <div style={withBorder ? styles.container : {}}>
      {accordionItems.map((item, index) => (
        <AccordionItem
          key={`${item.title}-${index}`}
          title={item.title || "Untitled Section"}
          isOpen={openIndices.includes(index)}
          onClick={() => handleClick(index)}
          withBorder={withBorder}
        >
          {item.content || "No content provided"}
        </AccordionItem>
      ))}
    </div>
  )
}

export { Accordion }
