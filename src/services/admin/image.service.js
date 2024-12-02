// src/services/admin/image.service.js
import createApiClient from "../api.service";
import systemConfig from '@/config/system/index.js'

class ImageService {
  constructor(baseUrl=`/${systemConfig.apiPrefix}/${systemConfig.adminPrefix}/images`) {
    this.api = createApiClient(baseUrl);
  }
  
  /**
   * Upload hình ảnh
   * @param {FormData} formData 
   * @param {Function} onUploadProgress - Callback để theo dõi tiến độ upload
   */
  async upload(formData) {
    return (await this.api.post('/upload', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })).data;
  }
}

export default new ImageService();
