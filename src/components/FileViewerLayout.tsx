import React from 'react';
import { View, StyleSheet } from 'react-native';

interface FileViewerLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function FileViewerLayout({ left, right }: FileViewerLayoutProps) {
  return (
    <View style={styles.container}>
      {/* Left Panel - File Viewer */}
      <View style={styles.leftPanel}>{left}</View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Right Panel - OCR Results (blank for now) */}
      <View style={styles.rightPanel}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  leftPanel: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    overflow: 'hidden',
  },
  divider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
});
