import JSZip from 'jszip';

export const handleZipFile = async (url) => {
  try {
    // Fetch the ZIP file
    const response = await fetch(url);
    const zipData = await response.arrayBuffer();
    
    // Load the ZIP file
    const zip = new JSZip();
    const contents = await zip.loadAsync(zipData);
    
    // Extract text content from files
    const textFiles = [];
    
    for (const [filename, file] of Object.entries(contents.files)) {
      if (!file.dir && filename.match(/\.(txt|html|htm)$/i)) {
        const content = await file.async('text');
        textFiles.push({ filename, content });
      }
    }
    
    return textFiles;
  } catch (error) {
    console.error('Error processing ZIP file:', error);
    throw error;
  }
}; 