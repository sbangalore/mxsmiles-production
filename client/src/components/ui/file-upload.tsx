import { useState, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function FileUpload({
  onFileSelect,
  accept = "image/*",
  maxSize = 10,
  className,
  disabled = false,
  label = "Upload Photo",
  description = "Click to upload or drag and drop",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview for images
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500 bg-red-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-32 mx-auto rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-gray-900">{selectedFile?.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              {selectedFile ? (
                <ImageIcon className="w-6 h-6 text-gray-600" />
              ) : (
                <Upload className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{description}</p>
              <p className="text-xs text-gray-400">
                Maximum file size: {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}