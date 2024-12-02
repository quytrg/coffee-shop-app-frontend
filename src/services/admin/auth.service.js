import createApiClient from "../api.service";
import systemConfig from '@/config/system/index.js'

class AuthService {
  constructor(baseUrl=`/${systemConfig.apiPrefix}/${systemConfig.adminPrefix}/users`) {
    this.api = createApiClient(baseUrl);
  }
  
  async login(account) {
    return (await this.api.post("/login", account)).data;
  }

  async logout() {
    return (await this.api.post("/logout")).data;
  }

  async getAuth() {
    return (await this.api.get('/me')).data
  }

}

export default new AuthService();
