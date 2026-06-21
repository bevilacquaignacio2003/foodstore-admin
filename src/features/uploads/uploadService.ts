import { apiClient } from "../../api/client";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export const uploadService = {
  uploadImagen: async (
    file: File,
    folder = "foodstore/productos"
  ): Promise<CloudinaryResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<CloudinaryResponse>(
      "/uploads/imagen",
      formData,
      {
        params: { folder },
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteImagen: async (publicId: string): Promise<void> => {
    await apiClient.delete(`/uploads/imagen/${encodeURIComponent(publicId)}`);
  },
};