import React, { useState } from "react";
import { View } from "react-native";
import FileViewerLayout from "@/components/FileViewerLayout";
import DropZone from "@/components/DropZone";
import PDFViewer from "@/components/PDFViewer";
import ImageViewer from "@/components/ImageViewer";
import { getFileType } from "@/utils/fileValidation";

export default function HomeScreen() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image' | null>(null);

  const handleFileDrop = (file: File) => {
    const type = getFileType(file);
    if (type) {
      setCurrentFile(file);
      setFileType(type);
    }
  };

  const handleClearFile = () => {
    setCurrentFile(null);
    setFileType(null);
  };

  // Render left panel content
  const leftPanelContent = currentFile ? (
    fileType === 'pdf' ? (
      <PDFViewer file={currentFile} onClear={handleClearFile} />
    ) : (
      <ImageViewer file={currentFile} onClear={handleClearFile} />
    )
  ) : (
    <DropZone onFileDrop={handleFileDrop} hasFile={!!currentFile} />
  );

  return (
    <FileViewerLayout
      left={leftPanelContent}
      right={<View />}
    />
  );
}
