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
  export function getCurrentDateAsString() {
    const currentDate = new Date();
  
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = currentDate.getFullYear().toString();
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');
  
    const dateString = `${day}-${month}-${year}-${hour}-${minute}`;
  
    return dateString;
  }
  