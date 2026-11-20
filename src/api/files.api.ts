import type { IApiResponse } from "@/lib/interfaces/common/base-res.interface";
import { request } from "@/api/axios/request";

export interface IUploadResponse {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

interface UploadFileVariables {
  file: File;
  endpoint: string;
  folder?: string;
}

export const fileApi = {
  async uploadFile({ endpoint, file, folder }: UploadFileVariables) {
    const formData = new FormData();

    formData.append("file", file);
    const folderQuery = folder
      ? `?folder=${encodeURIComponent(folder)}`
      : "";

    return request<IApiResponse<IUploadResponse>>({
      url: `${endpoint}${folderQuery}`,
      data: formData,
      method: "POST",
    });
  },

  async removeFile(url: string) {
    return request({ url: `files/delete-by-url?url=${url}`, method: "DELETE" });
  },
};
