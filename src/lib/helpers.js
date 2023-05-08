export function formatBytes(bytes) {
    const kilobytes = bytes / 1024;
    const megabytes = kilobytes / 1024;
  
    if (megabytes >= 1) {
      return megabytes.toFixed(2) + " MB";
    } else {
      return kilobytes.toFixed(2) + " KB";
    }
  }
  
  export function formatDate(input, format) {
    const date = new Date(input)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    format = format.replace("yyyy", year);
    format = format.replace("MM", month.toString().padStart(2, "0"));
    format = format.replace("dd", day.toString().padStart(2, "0"));
    format = format.replace("HH", hours.toString().padStart(2, "0"));
    format = format.replace("mm", minutes.toString().padStart(2, "0"));
    format = format.replace("ss", seconds.toString().padStart(2, "0"));
    
    return format;
  }
  