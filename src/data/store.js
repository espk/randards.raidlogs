/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import logsApi from "./logs"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logs: [],
    detailId: '',
    details: {},
    detailsLoaded: false
  },

  mutations: {
    clearData(state) {
      while (state.logs.length > 0) {
        state.logs.pop()
      }
    },
    addLog(state, payload) {
      state.logs.push({...payload, startDate: new Date(payload.start), endDate: new Date(payload.end)})
    },
    sortLogs(state) {
      state.logs.sort((logA, logB) => {
        // Sort by Year
        if (logA.startDate.getFullYear() !== logB.endDate.getFullYear()) {
          return logB.startDate.getFullYear() - logA.endDate.getFullYear()
        }
        // ...then Month
        if (logA.startDate.getMonth() !== logB.endDate.getMonth()) {
          return logB.startDate.getMonth() - logA.endDate.getMonth()
        }
        // ...then Day
        if (logA.startDate.getDate() !== logB.endDate.getDate()) {
          return logB.startDate.getDate() - logA.endDate.getDate()
        }        
        // Then alphabetically by uploader
        if (logA.owner.toLowerCase() < logB.owner.toLowerCase()) {
          return -1
        }
        if (logA.owner.toLowerCase() > logB.owner.toLowerCase()) {
          return 1
        }
        return 0;
      })
    },
    clearLogId(state) {
      state.detailId = ''
    },
    updateLogId(state, payload) {
      state.detailId = payload
    },
    appendDetails(state, payload) {
      state.details[payload.id] = payload.result
    },
    setLoading(state) {
      state.detailsLoaded = false
    },
    setLoaded(state) {
      state.detailsLoaded = true
    }
  },


  actions: {
    getAllLogs(context) {
      context.commit('clearData')

      logsApi.getGuillakLogs()
        .then(result => {
          result.data.forEach(log => context.commit('addLog', log))
          context.commit('sortLogs')
        })
        .catch(error => {
          console.log(error)
        })

      logsApi.getCretanLogs()
        .then(result => {
          result.data.forEach(log => context.commit('addLog', log))
          context.commit('sortLogs')
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadDetails(context, id) {
      
      if (!context.state.details[id]) {
        context.commit('setLoading')
        logsApi.getLogDetail(id)
        .then(result => {
          context.commit('appendDetails', { id: id, result: result.data})
          context.commit('setLoaded')
        })
        .catch(error => {
          console.log(error)
        })
      }
    }
  }
})