import { DownloadType } from "@/config/site.enum";
import { AxiosResponse } from "axios"
export const downloadFile = async (response: AxiosResponse<any, any>, type: DownloadType) => {
   // Assuming the response data contains fileName and fileData
   const { filename, filedata } = response.data;

   let cleanedBase64 = filedata.replace(/[^A-Za-z0-9+/=]/g, ''); 

   // Convert Base64 string to a binary string
   const byteCharacters = atob(cleanedBase64); // Decode Base64 string
   const byteNumbers = new Uint8Array(byteCharacters.length);

   for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
   }

   // Create a Blob from the byte numbers
   const blob = new Blob([byteNumbers], { type: type });

   // Create a URL for the Blob
   const url = window.URL.createObjectURL(blob);

   // Create a link element to download the file
   const a = document.createElement('a');
   a.href = url;
   a.download = filename; // Use the filename from the response
   document.body.appendChild(a);
   a.click(); // Trigger the download
   document.body.removeChild(a); // Clean up the DOM
   window.URL.revokeObjectURL(url); // Release the object URL
}


