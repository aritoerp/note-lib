import { API_HOST } from "../env";

export const getFileUrl = (accessToken: string | null | undefined, file_id: string | null | undefined, df_url: string = '') => {
  if (file_id && accessToken) {
    const tokenPart = accessToken.split(".")[2];
    return `${API_HOST}/DownloadFile0/${file_id}/${tokenPart}`;
  }
  return df_url;
};