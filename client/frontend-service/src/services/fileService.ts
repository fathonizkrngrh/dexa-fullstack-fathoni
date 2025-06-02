import { FILE_API } from "@/lib/axios";

export interface UploadFilePayload {
    foldername: string;
    file: File | Blob;
}

export const uploadFile = async ({ foldername, file }: UploadFilePayload) => {
    try {
        const formData = new FormData();
        formData.append('foldername', foldername);
        formData.append('photo', file);

        const response = await FILE_API.post('/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Failed to upload file:', error);
        throw error?.response?.data || error;
    }
};

export interface DeleteFilePayload {
    public_id: string;
}

export const deleteFile = async ({ public_id }: DeleteFilePayload) => {
    try {
        const response = await FILE_API.post('/file/delete', { public_id });
        return response.data;
    } catch (error: any) {
        console.error('Failed to delete file:', error);
        throw error?.response?.data || error;
    }
};