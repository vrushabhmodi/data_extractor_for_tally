import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';

interface ImageViewerProps {
  file: File;
  onClear: () => void;
}

export default function ImageViewer({ file, onClear }: ImageViewerProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageSrc(e.target?.result as string);
          setIsLoading(false);
        };
        reader.onerror = () => {
          console.error('Error loading image');
          alert('Failed to load image');
          onClear();
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error loading image:', error);
        onClear();
      }
    };

    loadImage();
  }, [file, onClear]);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Pressable style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      {/* Image Display Area */}
      <ScrollView style={styles.viewerContainer} scrollEnabled={true}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading image...</Text>
          </View>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={file.name}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ff6b6b',
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
