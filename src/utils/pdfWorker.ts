// Workaround for pdfjs-dist bundling issues with dynamic imports
// This file provides proper worker URL configuration

export function initPDFWorker() {
  // Use the CDN-hosted worker to avoid bundling issues
  const pdfjsLib = require('pdfjs-dist');
  
  // Use HTTPS CDN URL
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  return pdfjsLib;
}
