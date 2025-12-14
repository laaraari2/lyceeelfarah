/**
 * Compresses an image file by resizing and reducing quality.
 * @param file The original image file.
 * @param quality Quality of the output image (0 to 1). Default is 0.7.
 * @param maxWidth Maximum width of the output image. Default is 1200px.
 * @returns A promise that resolves to the Base64 string of the compressed image.
 */
export const compressImage = (
  file: File,
  quality: number = 0.7,
  maxWidth: number = 1200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context is not available"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert key format to jpeg for better compression
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
