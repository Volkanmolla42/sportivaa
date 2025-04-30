"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { captureError } from "@/services/errorService";

interface UploadProgress {
  progress: number;
  isUploading: boolean;
}

interface UploadResult {
  path: string;
  url: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

interface UseMediaUploadOptions {
  bucket?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  maxDimensions?: ImageDimensions;
  generateThumbnail?: boolean;
}

export function useMediaUpload({
  bucket = "media",
  maxSizeInMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxDimensions,
  generateThumbnail = false,
}: UseMediaUploadOptions = {}) {
  const { toast } = useToast();
  const [progress, setProgress] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
  });

  // Validate file size and type
  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizeInMB * 1024 * 1024) {
        return `Dosya boyutu ${maxSizeInMB}MB'dan büyük olamaz`;
      }

      if (!allowedTypes.includes(file.type)) {
        return `Desteklenmeyen dosya türü. İzin verilen türler: ${allowedTypes.join(
          ", "
        )}`;
      }

      return null;
    },
    [maxSizeInMB, allowedTypes]
  );

  // Process image dimensions and create thumbnail if needed
  const processImage = useCallback(
    async (file: File): Promise<{ file: File; thumbnail?: File }> => {
      if (!file.type.startsWith("image/")) {
        return { file };
      }

      return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };

        img.onload = async () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          // Resize if dimensions exceed max
          if (maxDimensions) {
            if (width > maxDimensions.width) {
              height = (height * maxDimensions.width) / width;
              width = maxDimensions.width;
            }
            if (height > maxDimensions.height) {
              width = (width * maxDimensions.height) / height;
              height = maxDimensions.height;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert processed image to file
          const processedBlob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((blob) => resolve(blob!), file.type, 0.9)
          );

          const processedFile = new File([processedBlob], file.name, {
            type: file.type,
          });

          // Generate thumbnail if needed
          if (generateThumbnail) {
            const thumbCanvas = document.createElement("canvas");
            const THUMB_SIZE = 200;
            let thumbWidth = THUMB_SIZE;
            let thumbHeight = (height * THUMB_SIZE) / width;

            if (thumbHeight > THUMB_SIZE) {
              thumbWidth = (width * THUMB_SIZE) / height;
              thumbHeight = THUMB_SIZE;
            }

            thumbCanvas.width = thumbWidth;
            thumbCanvas.height = thumbHeight;

            const thumbCtx = thumbCanvas.getContext("2d");
            thumbCtx?.drawImage(img, 0, 0, thumbWidth, thumbHeight);

            const thumbBlob = await new Promise<Blob>((resolve) =>
              thumbCanvas.toBlob((blob) => resolve(blob!), file.type, 0.8)
            );

            const thumbnailFile = new File(
              [thumbBlob],
              `thumb_${file.name}`,
              { type: file.type }
            );

            resolve({ file: processedFile, thumbnail: thumbnailFile });
          } else {
            resolve({ file: processedFile });
          }
        };

        reader.readAsDataURL(file);
      });
    },
    [maxDimensions, generateThumbnail]
  );

  // Upload file to Supabase storage
  const uploadFile = useCallback(
    async (
      file: File,
      path: string,
      onProgress?: (progress: number) => void
    ): Promise<UploadResult> => {
      try {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
            onUploadProgress: ({ loaded, total }) => {
              const progress = (loaded / total) * 100;
              setProgress({ progress, isUploading: true });
              onProgress?.(progress);
            },
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);

        return {
          path,
          url: urlData.publicUrl,
        };
      } catch (error) {
        captureError(error, {
          component: "useMediaUpload",
          additionalData: { path, fileName: file.name },
        });
        throw error;
      } finally {
        setProgress({ progress: 0, isUploading: false });
      }
    },
    [bucket]
  );

  // Main upload function
  const upload = useCallback(
    async (
      file: File,
      customPath?: string
    ): Promise<{ original: UploadResult; thumbnail?: UploadResult }> => {
      try {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        setProgress({ progress: 0, isUploading: true });

        // Process image if needed
        const { file: processedFile, thumbnail } = await processImage(file);

        // Generate unique path if not provided
        const timestamp = new Date().getTime();
        const basePath = customPath || `uploads/${timestamp}_${file.name}`;

        // Upload original file
        const original = await uploadFile(processedFile, basePath);

        // Upload thumbnail if available
        let thumbnailResult: UploadResult | undefined;
        if (thumbnail) {
          const thumbPath = basePath.replace(
            /(\.[^.]+)$/,
            "_thumb$1"
          );
          thumbnailResult = await uploadFile(thumbnail, thumbPath);
        }

        return {
          original,
          thumbnail: thumbnailResult,
        };
      } catch (error) {
        captureError(error, {
          component: "useMediaUpload",
          additionalData: { fileName: file.name },
        });

        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Dosya yüklenirken bir hata oluştu",
          variant: "destructive",
        });

        throw error;
      } finally {
        setProgress({ progress: 0, isUploading: false });
      }
    },
    [validateFile, processImage, uploadFile, toast]
  );

  // Delete file from storage
  const deleteFile = useCallback(
    async (path: string): Promise<void> => {
      try {
        const { error } = await supabase.storage
          .from(bucket)
          .remove([path]);

        if (error) throw error;

        // If it's an image, try to delete thumbnail as well
        if (path.match(/\.(jpg|jpeg|png|webp)$/i)) {
          const thumbPath = path.replace(
            /(\.[^.]+)$/,
            "_thumb$1"
          );
          await supabase.storage
            .from(bucket)
            .remove([thumbPath])
            .catch(() => {}); // Ignore thumbnail deletion errors
        }
      } catch (error) {
        captureError(error, {
          component: "useMediaUpload",
          additionalData: { path },
        });

        toast({
          title: "Hata",
          description: "Dosya silinirken bir hata oluştu",
          variant: "destructive",
        });

        throw error;
      }
    },
    [bucket, toast]
  );

  return {
    upload,
    deleteFile,
    progress,
  };
}
