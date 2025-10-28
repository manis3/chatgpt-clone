"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
}

export const FilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  (props, ref) => {
    if (props.file.type.startsWith("image/")) {
      return <ImageFilePreview {...props} ref={ref} />;
    }
    if (
      props.file.type.startsWith("text/") ||
      props.file.type.startsWith(".txt") ||
      props.file.type.startsWith(".md")
    ) {
      return <TextFilePreview {...props} ref={ref} />;
    }

    return <GenericFilePreview {...props} ref={ref} />;
  }
);

FilePreview.displayName = "FilePreview";

const ImageFilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, onRemove }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="relative flex max-w-[200px] rounded-md border p-1.5 pr-2 text-xs"
        layout
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
      >
        <div className="flex w-full items-center space-x-2">
          <Image
            alt={`Attachment ${file.name}`}
            fill
            className="w-10 h-10 gird shrink-0 place-items-center rounded-sm border bg-muted object-cover"
            src={URL.createObjectURL(file)}
          />
          <span className="w-full truncate text-muted-foreground">
            {file.name}
          </span>
        </div>
        {onRemove && (
          <button
            className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full border bg-background"
            type="button"
            onClick={onRemove}
            aria-label="Remove attachment"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </motion.div>
    );
  }
);

ImageFilePreview.displayName = "ImageFilePreview";
