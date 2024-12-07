import createApiClient from "../api.service";
import systemConfig from '@/config/system/index.js'

class OrderService {
  constructor(baseUrl=`/${systemConfig.apiPrefix}/${systemConfig.adminPrefix}/orders`) {
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

  async getOrderItemReports(options={}) {
    return (await this.api.get('/order-items/report', options)).data;
  }

  async deleteOne(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new OrderService();
