import { AxiosResponse } from "axios";

enum DownloadType {
   PDF = 'application/pdf',
   EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
   CSV = 'text/csv',
}


const downloadFile = (response: AxiosResponse<any, any>, type: DownloadType) => {
   const blob = new Blob([response.data], { type: type });
   const url = window.URL.createObjectURL(blob);
   if(type !== DownloadType.PDF) {
      const a = document.createElement('a')
      a.href = url
      a.download = extractFileName(response)
      a.click()
      document.body.appendChild(a)
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return
   }
   window.open(url, '_blank');
}


const extractFileName = (response: AxiosResponse<any, any>): string => {
   const contentDisposition = response.headers['content-disposition'];
   const fileName = contentDisposition.split('filename=')[1];
   return fileName;
}