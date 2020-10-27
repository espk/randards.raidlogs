<template>
  <div>
    <div><a href="#" @click="setList('raids')">Raids</a> | <a href="#" @click="setList('dungeons')">Dungeons</a></div>
    <ul v-show="currentList === 'raids'">
      <li v-for="log in raids" v-bind:key="log.id">
        <span class="log-date">{{ log.startDate.toLocaleDateString('en-us') }}</span> 
        <span class="log-title">{{log.title}} ({{ log.owner }})</span>
        <span class="log-details-button"><button @click="toggleDetails(log.id)">view details</button></span>
        <div v-if="isCurrentLog(log.id)">
          <ul v-if="detailsLoaded">
            <li v-for="fight in details[detailId].fights" v-bind:key="fight.name + fight.start_time">{{ fight.name }}</li>
          </ul>
        </div>
      </li>
    </ul>
    <ul v-show="currentList === 'dungeons'">
      <li v-for="log in dungeons" v-bind:key="log.id">
        <span class="log-date">{{ log.startDate.toLocaleDateString('en-us') }}</span> 
        <span class="log-title">{{log.title}} ({{ log.owner }})</span>
        <span class="log-details-button"><button @click="toggleDetails(log.id)">view details</button></span>
        <div v-if="isCurrentLog(log.id)">
          <ul v-if="detailsLoaded">
            <li v-for="fight in details[detailId].fights" v-bind:key="fight.name + fight.start_time">{{ fight.name }}</li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import store from "../data/store";
import { mapState } from "vuex";

export default {
  name: 'WarcraftLogs',
  store,
  data: function () {
    return {
      currentList: 'raids'
    }
  },
  computed: mapState({
    logs: state => state.logs, 
    detailId: state => state.detailId, 
    details: state => state.details, 
    detailsLoaded: state => state.detailsLoaded,
    dungeons: function(state) {
      return state.logs.filter(l => (l.title.toLowerCase().includes('dungeon') || l.title.toLowerCase().includes('mythic+')))  
    },
    raids: function(state) {
      return state.logs.filter(l => (!(l.title.toLowerCase().includes('dungeon') || l.title.toLowerCase().includes('mythic+'))))
    }
  }),
  methods: {
    toggleDetails: function(id) {
      if (this.detailId !== id) {
        this.$store.commit("updateLogId", id)
        this.$store.dispatch("loadDetails", id)
      } else {
        this.$store.commit("clearLogId")
      }
      
    },
    isCurrentLog: function(id) {
      return (this.detailId === id)
    },
    setList(listType) {
      this.currentList = listType
    }
  },
  mounted: function() {
    this.$store.dispatch("getAllLogs");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  list-style: none;
}
.log-date {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 20px;
}
</style>
