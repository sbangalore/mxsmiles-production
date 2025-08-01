import { useState, useRef } from "react";
import { Button } from "./button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PhotoUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  maxSizeInMB?: number;
  className?: string;
  uploadText?: string;
  disabled?: boolean;
}

interface UploadProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export function PhotoUpload({
  onUploadComplete,
  onUploadError,
  multiple = false,
  maxFiles = 5,
  accept = "image/*",
  maxSizeInMB = 5,
  className = "",
  uploadText = "Upload Photos",
  disabled = false
}: PhotoUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return "Only image files are allowed";
    }

    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    return null;
  };

  const uploadFile = async (file: File, index: number) => {
    try {
      // Get presigned URL
      const response = await fetch("/api/upload/presigned-url", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folder: 'consultation-photos'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }
      
      const { data } = await response.json() as { data: { uploadUrl: string; fileUrl: string } };

      const { uploadUrl, fileUrl } = data;

      // Upload file to S3 using presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      // Update progress
      setUploads(prev => prev.map((upload, i) => 
        i === index ? { ...upload, progress: 100, url: fileUrl } : upload
      ));

      onUploadComplete(fileUrl);

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploads(prev => prev.map((upload, i) => 
        i === index ? { ...upload, error: errorMessage } : upload
      ));
      
      onUploadError(errorMessage);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (!files.length) return;

    // Validate file count
    if (multiple && uploads.length + files.length > maxFiles) {
      onUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (!multiple && files.length > 1) {
      onUploadError("Only one file allowed");
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        onUploadError(`${file.name}: ${error}`);
        return;
      }
      validFiles.push(file);
    }

    if (!multiple) {
      // For single upload, replace existing uploads
      setUploads([]);
    }

    // Add files to upload queue
    const newUploads: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0
    }));

    setUploads(prev => [...prev, ...newUploads]);
    setIsUploading(true);

    // Start uploads
    const startIndex = multiple ? uploads.length : 0;
    for (let i = 0; i < validFiles.length; i++) {
      uploadFile(validFiles[i], startIndex + i);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsUploading(false);
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <Button
        type="button"
        variant="outline"
        onClick={triggerFileSelect}
        disabled={disabled || isUploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : uploadText}
      </Button>

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              <ImageIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {upload.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
                
                {upload.error && (
                  <p className="text-xs text-red-600 mt-1">{upload.error}</p>
                )}
                
                {!upload.error && upload.progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}
                
                {upload.url && (
                  <p className="text-xs text-green-600 mt-1">✓ Uploaded successfully</p>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeUpload(index)}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {multiple && (
        <p className="text-xs text-gray-500">
          {uploads.length}/{maxFiles} files uploaded. Max size: {maxSizeInMB}MB per file.
        </p>
      )}
    </div>
  );
}