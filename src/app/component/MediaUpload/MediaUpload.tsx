"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Video, FileText } from "lucide-react";
import Image from "next/image";

interface MediaUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  existingMedia?: string[];
  maxFiles?: number;
  accept?: string;
}

export function MediaUpload({
  files,
  onChange,
  existingMedia = [],
  maxFiles = 10,
  accept = "image/*,video/*",
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);
    const updatedFiles = [...files, ...newFiles];
    onChange(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon size={16} aria-label="Image file" />;
    if (file.type.startsWith("video/")) return <Video size={16} aria-label="Video file" />;
    return <FileText size={16} aria-label="File" />;
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|avi|mov)$/i.test(url);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-gray-600 hover:border-gray-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-white mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-400">
            Support for images and videos (max {maxFiles} files)
          </p>
        </div>
      </div>

      {/* Existing Media Preview */}
      {/* Existing Media Preview */}
      {existingMedia.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Current Media
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {existingMedia.map((url, index) => (
              <div key={index} className="relative group">
                {isImage(url) ? (
                  <Image
                    src={url}
                    alt={`Media ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : isVideo(url) ? (
                  <video
                    src={url}
                    className="w-full h-24 object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="text-gray-400" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* New Files Preview */}
      {/* New Files Preview */}
      {files.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            New Files ({files.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={96}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-700 rounded-lg flex flex-col items-center justify-center p-2">
                    {getFileIcon(file)}
                    <span className="text-xs text-gray-400 mt-1 truncate w-full text-center">
                      {file.name}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
