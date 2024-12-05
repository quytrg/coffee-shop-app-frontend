import createApiClient from "../api.service";
import systemConfig from '@/config/system/index.js'

class SupplyOrderService {
  constructor(baseUrl=`/${systemConfig.apiPrefix}/${systemConfig.adminPrefix}/supply-orders`) {
    this.api = createApiClient(baseUrl);
  }
  
  async getAll(options={}) {
    return (await this.api.get('/', options)).data;
  }

  async create(data) {
    return (await this.api.post('/', data)).data
  }

  async getOne(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.patch(`/${id}`, data)).data;
  }

  async deleteOne(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async completeSupplyOrder(id) {
    return (await this.api.patch(`/${id}/complete`)).data;
  }
}

export default new SupplyOrderService();
