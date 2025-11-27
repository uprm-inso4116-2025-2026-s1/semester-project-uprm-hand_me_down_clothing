import React, { useState, useEffect } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { supabase } from "../../app/auth/supabaseClient";

interface ImageUploaderProps {
  listingId: string;
  onUploadComplete?: (urls: string[]) => void; // Return uploaded URLs
}

const MIN_IMAGES = 1;
const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  listingId,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<(FileWithPath & { preview: string })[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  // Handle dropped files
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    if (files.length + acceptedFiles.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const validated = acceptedFiles
      .filter((file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError(`File type not allowed: ${file.name}`);
          return false;
        }
        if (file.size > MAX_FILE_SIZE) {
          setError(`File too large: ${file.name}`);
          return false;
        }
        return true;
      })
      .map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }));

    setFiles((prev) => [...prev, ...validated]);
    setError("");
  };

  // TypeScript-safe dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  } as any);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  // Remove a file from preview list
  const removeFile = (index: number) => {
    URL.revokeObjectURL(files[index].preview);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload images to Supabase Storage
  const handleUpload = async () => {
    if (files.length < MIN_IMAGES) {
      setError(`Please upload at least ${MIN_IMAGES} image(s).`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const urls: string[] = [];

      for (const file of files) {
        const fileName = `${listingId}/${Date.now()}_${file.name}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("listings-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("listings-images").getPublicUrl(fileName);

        if (!publicUrl) throw new Error("Failed to get public URL");
        urls.push(publicUrl);
      }

      // Update listing record with image URLs
      const { error: dbError } = await supabase
        .from("listings")
        .update({ image_urls: urls })
        .eq("id", listingId);

      if (dbError) throw dbError;

      setUploadedUrls(urls);
      setFiles([]);
      alert("Images uploaded successfully!");

      // Return URLs to parent component
      if (onUploadComplete) onUploadComplete(urls);
    } catch (err) {
      console.error(err);
      setError("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl px-6 py-10 flex justify-center cursor-pointer transition-all ${
          isDragActive
            ? "border-[#abc8c1] bg-[#f4f8f7]"
            : "border-[#E5E7EF] hover:border-[#abc8c1]"
        }`}
      >
        <input {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
        <p>
          {isDragActive
            ? "Drop the files here ..."
            : "Drag & drop images here, or click to select files"}
        </p>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Previews */}
      <div className="flex flex-wrap gap-2 mt-4">
        {files.map((file, index) => (
          <div key={index} className="relative w-24 h-24">
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-sm flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length < MIN_IMAGES}
        className={`mt-4 px-4 py-2 rounded-full text-white transition ${
          uploading || files.length < MIN_IMAGES
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#abc8c1] hover:bg-[#8bb5aa]"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>

      {/* Image count info */}
      <p className="text-sm text-gray-500 mt-2">
        {files.length}/{MAX_IMAGES} selected
      </p>

      {/* Uploaded images summary (after successful upload) */}
      {uploadedUrls.length > 0 && (
        <div className="mt-3 text-sm text-green-600">
          {uploadedUrls.length} image(s) successfully uploaded.
        </div>
      )}
    </div>
  );
};