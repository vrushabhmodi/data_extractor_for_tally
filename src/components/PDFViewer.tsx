import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

interface PDFViewerProps {
  file: File;
  onClear: () => void;
}

// Global PDF.js instance to avoid reloading
let globalPdfjsLib: any = null;
let pdfjsLoadPromise: Promise<any> | null = null;

function loadPDFJS() {
  if (globalPdfjsLib) {
    return Promise.resolve(globalPdfjsLib);
  }

  if (pdfjsLoadPromise) {
    return pdfjsLoadPromise;
  }

  pdfjsLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded in window
    if ((window as any).pdfjsLib) {
      globalPdfjsLib = (window as any).pdfjsLib;
      globalPdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(globalPdfjsLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        globalPdfjsLib = pdfjs;
        resolve(pdfjs);
      } else {
        reject(new Error('PDF.js failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
    document.head.appendChild(script);
  });

  return pdfjsLoadPromise;
}

export default function PDFViewer({ file, onClear }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdf, setPdf] = useState<any>(null);
  const [renderedImage, setRenderedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load PDF file
  useEffect(() => {
    let isMounted = true;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError('');
        const pdfjs = await loadPDFJS();
        const arrayBuffer = await file.arrayBuffer();
        console.log('Loading PDF:', file.name, 'size:', arrayBuffer.byteLength);
        const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        if (isMounted) {
          setPdf(pdfDoc);
          setTotalPages(pdfDoc.numPages);
          setCurrentPage(1);
          console.log('PDF loaded successfully:', pdfDoc.numPages, 'pages');
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
        if (isMounted) {
          setError('Failed to load PDF file. Please try another file.');
          setIsLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    let isMounted = true;

    const renderPage = async () => {
      try {
        setIsLoading(true);
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        if (!context) {
          console.error('Failed to get canvas context');
          return;
        }

        // Render page to canvas
        const renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });

        await renderTask.promise;

        if (isMounted) {
          setRenderedImage(canvas.toDataURL('image/png'));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error rendering page:', error);
        if (isMounted) {
          setError('Failed to render PDF page');
          setIsLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
    };
  }, [pdf, currentPage]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Pressable style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      {/* Page Navigation */}
      <View style={styles.navigationBar}>
        <Pressable
          style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]}
          onPress={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </Pressable>

        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>

        <Pressable
          style={[styles.navButton, currentPage === totalPages && styles.navButtonDisabled]}
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </Pressable>
      </View>

      {/* Hidden Canvas for PDF rendering */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* PDF Display Area */}
      <ScrollView style={styles.viewerContainer} scrollEnabled={true}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading page...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={onClear}>
              <Text style={styles.retryButtonText}>Go Back</Text>
            </Pressable>
          </View>
        ) : renderedImage ? (
          <img
            src={renderedImage}
            alt={`Page ${currentPage}`}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
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
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0066cc',
    borderRadius: 4,
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  pageInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0066cc',
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
