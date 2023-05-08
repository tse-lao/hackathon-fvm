export function formatBytes(bytes) {
    const kilobytes = bytes / 1024;
    const megabytes = kilobytes / 1024;
  
    if (megabytes >= 1) {
      return megabytes.toFixed(2) + " MB";
    } else {
      return kilobytes.toFixed(2) + " KB";
    }
  }