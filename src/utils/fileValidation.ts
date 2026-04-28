/**
 * File validation utilities for accepted file types
 */

const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * Validates if a file is of accepted type (PDF or image)
 */
export function isValidFileType(file: File): boolean {
  // Check MIME type
  if (ACCEPTED_MIME_TYPES.includes(file.type)) {
    return true;
  }

  // Fallback: check file extension
  const fileName = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

/**
 * Determines file type: 'pdf' or 'image'
 */
export function getFileType(file: File): 'pdf' | 'image' | null {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return 'pdf';
  }
  if (file.type.startsWith('image/')) {
    return 'image';
  }
  return null;
}

/**
 * Converts File to Data URL for easy manipulation
 */
export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
