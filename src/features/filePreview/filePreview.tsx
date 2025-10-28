'use client'
import React from "react";
import {motion} from "framer-motion"

interface FilePreviewProps {
    file: File,
    onRemove?: () => void
}

export const FilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  (props, ref) => {
    if(props.file.type.startsWith("image/")) {
        return <ImageFilePreview {...props} ref={ref} />
    }
    if(props.file.type.startsWith("text/") || props.file.type.startsWith(".txt") || props.file.type.startsWith(".md")){
        return <TextFilePreview {...props} ref={ref} />
    }

    return <GenericFilePreview {...props} ref={ref} />
}
)

FilePreview.displayName = "FilePreview"



const ImageFilePreview =React.forwardRef<HTMLDivElement, FilePreviewProps>(({file, onRemove}, ref) => {
return (
    <motion.div>

    </motion.div>
)
})
