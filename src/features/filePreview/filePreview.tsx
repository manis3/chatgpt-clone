"use client";
import React, { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import { button } from "framer-motion/client";

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

interface FilePreviewAnimationProps {
  ref: React.Ref<HTMLDivElement>;
  children: ReactNode;
  onRemove?: () => void;
}

const FilePreviewAnimaion = ({
  ref,
  children,
  onRemove,
}: FilePreviewAnimationProps) => {
  return (
    <motion.div
      ref={ref}
      className="relative flex max-w-[200px] rounded-md border p-1.5 pr-2 text-xs"
      layout
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
    >
      {children}
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
};

const ImageFilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, onRemove }, ref) => {
    return (
      <FilePreviewAnimaion ref={ref} onRemove={onRemove}>
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
      </FilePreviewAnimaion>
    );
  }
);

ImageFilePreview.displayName = "ImageFilePreview";

const GenericFilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, onRemove }, ref) => {
    return (
      <FilePreviewAnimaion ref={ref} onRemove={onRemove}>
        <div className="flex w-full items-center space-x-2">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border bg-muted">
            <FileIcon className="h-6 w-6 text-foreground" />
          </div>
          <span className="w-full truncate text-muted-foreground">
            {file.name}
          </span>
        </div>
      </FilePreviewAnimaion>
    );
  }
);

const TextFilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, onRemove }, ref) => {
    const [preview, setPreview] = React.useState<string>("");

    useEffect(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setPreview(text.slice(0, 50) + (text.length > 50 ? "..." : ""));
      };
      reader.readAsText(file);
    }, [file]);
    return (
      <FilePreviewAnimaion ref={ref} onRemove={onRemove}>
        <div className="flex w-full items-center space-x-2">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border bg-muted p-0.5">
            <div className="h-full w-full overflow-hidden text-[6px] leading-none text-muted-foreground">
              {preview || "Loading..."}
            </div>
          </div>
          <span className="w-full truncate text-muted-foreground">
            {file.name}
          </span>
        </div>
      </FilePreviewAnimaion>
    );
  }
);
