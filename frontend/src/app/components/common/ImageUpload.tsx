import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const isCloudinaryConfigured = !!cloudName && !!uploadPreset;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!isCloudinaryConfigured) {
      setUploadError('Cloudinary is not configured in .env. Please use the URL option.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const newImageUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        newImageUrls.push(data.secure_url);
      }

      onChange([...images, ...newImageUrls]);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError('Failed to upload image(s). Please try again or check your Cloudinary configuration.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  const handleAddManualUrl = () => {
    if (manualUrl.trim()) {
      onChange([...images, manualUrl.trim()]);
      setManualUrl('');
      setShowManualUrl(false);
      setUploadError('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          isUploading ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50/50 dark:bg-gray-800/40'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Upload className={`w-8 h-8 ${isUploading ? 'text-blue-500 animate-bounce' : 'text-gray-400 dark:text-gray-500'}`} />
          </div>
          
          {isUploading ? (
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Uploading images...</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please wait</p>
            </div>
          ) : (
            <div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                Drag & drop your images here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                Supports JPG, PNG, WEBP
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 shadow-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  Browse Files
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium flex items-center gap-2 shadow-sm"
                >
                  <LinkIcon className="w-4 h-4" />
                  Paste URL
                </button>
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{uploadError}</p>
      )}

      {/* Manual URL Input */}
      {showManualUrl && (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddManualUrl())}
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 transition text-sm font-semibold"
          >
            Add
          </button>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Uploaded Images ({images.length}) {images.length > 0 && <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">The first image will be the primary thumbnail.</span>}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={url}
                  alt={`Upload preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transform hover:scale-110 transition shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
