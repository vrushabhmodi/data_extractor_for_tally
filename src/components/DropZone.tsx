import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isValidFileType } from '@/utils/fileValidation';

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  hasFile: boolean;
}

export default function DropZone({ onFileDrop, hasFile }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    // Track drag counter to handle nested elements
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragOver(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter = 0;
      setIsDragOver(false);

      if (e.dataTransfer?.files) {
        const files = Array.from(e.dataTransfer.files);
        console.log('Files dropped:', files);

        const validFile = files.find((file) => isValidFileType(file));

        if (validFile) {
          console.log('Valid file found:', validFile.name);
          onFileDrop(validFile);
        } else if (files.length > 0) {
          alert('Please drop a PDF or image file (JPG, PNG, GIF, WebP)');
        }
      }
    };

    // Attach listeners to window/document
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [onFileDrop]);

  if (hasFile) {
    return null; // Don't show drop zone if file is already loaded
  }

  return (
    <View style={[styles.dropZone, isDragOver && styles.dropZoneActive]}>
      <Text style={styles.dropText}>📄 Drag and drop a PDF or image here</Text>
      <Text style={styles.dropSubtext}>Supported: PDF, JPG, PNG, GIF, WebP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dropZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed' as any,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
  } as any,
  dropZoneActive: {
    borderColor: '#0066cc',
    backgroundColor: '#e6f2ff',
  },
  dropText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  dropSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
