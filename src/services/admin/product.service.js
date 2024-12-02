import createApiClient from "../api.service";
import systemConfig from '@/config/system/index.js'

class ProductService {
  constructor(baseUrl=`/${systemConfig.apiPrefix}/${systemConfig.adminPrefix}/products`) {
    this.api = createApiClient(baseUrl);
  }
  
  async get(options={}) {
    return (await this.api.get('/', options)).data;
  }

  // async changeMulti(data) {
  //   return (await this.api.patch('/change-multi', data)).data
  // }

  // async changeStatus(id, data) {
  //   return (await this.api.patch(`change-status/${id}`, data)).data
  // }

  async create(data) {
    return (await this.api.post('/', data)).data
  }

  async getProductById(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.patch(`/${id}`, data)).data;
  }

  async deleteOne(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async getAllVariants(id, options={}) {
    return (await this.api.get(`/${id}/variants`, options)).data;
  }

  async getVariantProductIdAndId(productId, variantId) {
    return (await this.api.get(`/${productId}/variants/${variantId}`)).data;
  }

  async createVariant(productId, data) {
    return (await this.api.post(`/${productId}/variants`, data)).data
  }

  async updateVariant(productId, variantId, data) {
    return (await this.api.patch(`/${productId}/variants/${variantId}`, data)).data;
  }

  async deleteVariant(productId, variantId) {
    return (await this.api.delete(`/${productId}/variants/${variantId}`)).data;
  }
}

export default new ProductService();
