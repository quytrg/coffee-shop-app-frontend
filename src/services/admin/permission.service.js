import createApiClient from "../api.service";
import systemConfig from '@/config/system/index.js'

class PermissionService {
  constructor(baseUrl=`/${systemConfig.apiPrefix}/${systemConfig.adminPrefix}/permissions`) {
    this.api = createApiClient(baseUrl);
  }
  
  async getAll(options={}) {
    return (await this.api.get("/", options)).data;
  }

}

export default new PermissionService();
