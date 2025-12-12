import React, { useRef } from 'react';

interface ImageUploaderProps {
  src: string;
  alt: string;
  onUpload: (base64: string) => void;
  isEditable: boolean;
  className?: string;
  containerClassName?: string;
  overlayText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  src,
  alt,
  onUpload,
  isEditable,
  className = "",
  containerClassName = "",
  overlayText = "Click to Upload"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onUpload(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (isEditable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`relative group ${containerClassName} ${isEditable ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <img src={src} alt={alt} className={className} />

      {isEditable && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-inherit">
            <div className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {overlayText}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageUploader;