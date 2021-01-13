import axios from '../../node_modules/axios'
import config from './config'

export default {
  apiRoot: config.apiRoot,
  apiKey: config.apiKey,

  getGuillakLogs() {
    return axios.get(this.apiRoot + '/reports/user/guillak' + this.apiKey);
  },

  getCretanLogs() {
    return axios.get(this.apiRoot + '/reports/guild/Evil%20SuperPoweredKitties/Whisperwind/US' + this.apiKey);
  },

  getLogDetail(id) {
    return axios.get(this.apiRoot + '/report/fights/' + id + this.apiKey)
  }
  
}