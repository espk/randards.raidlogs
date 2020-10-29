<template>
  <div>
    <div class="log-filter">
      <button @click="setList('raids')" :class="isActive('raids')">Raids</button> 
      | 
      <button @click="setList('dungeons')" :class="isActive('dungeons')">Dungeons</button>
    </div>
    <ul class="logs-list">
      <li v-for="log in currentList" v-bind:key="log.id" class="log-item">
        <span class="log-date" @click="navigateToLog(log.id)">{{ formatDate(log.startDate) }}</span> 
        <span class="log-title" @click="navigateToLog(log.id)">{{log.title}} (<span class="owner" v-bind:class="ownerClass(log.owner)">{{ log.owner.toLowerCase() }}</span>)</span>
        <span class="log-details-button"><button @click="toggleDetails(log.id)">toggle details</button></span>
        <div v-if="isCurrentLog(log.id)" class="log-detail">
          <ul v-if="detailsLoaded" class="log-members">
            <li v-for="member in detailsMembers" v-bind:key="member.name" v-bind:class="member.type.toLowerCase()">{{ member.name }}</li>
          </ul>
          <ul v-if="detailsLoaded" class="log-fights">
            <li v-for="fight in currentFights" v-bind:key="fight.name + fight.start_time" :class="bossClass(fight)">{{ fight.name }}</li>
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
      currentCategory: 'raids'
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
      return state.logs.filter(l => (!(l.title.toLowerCase().includes('dungeon') || l.title.toLowerCase().includes('mythic+')) && l.title.toLowerCase() !== 'unknown zone'))
    },
    detailsMembers: function() {
      return this.details[this.detailId].friendlies.filter(f => !['pet','npc','boss'].includes(f.type.toLowerCase()))
    },
    currentList: function() {
      if (this.currentCategory === 'dungeons') return this.dungeons
      if (this.currentCategory === 'raids') return this.raids

      return []
    },
    currentFights: function() {
      return this.details[this.detailId].fights.filter(f => f.boss !== 0)
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
      this.currentCategory = listType
    },
    formatDate(date) {
      let year = date.getFullYear().toString()
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    ownerClass(toon) {
      if (toon.toLowerCase() === 'cretan')
        return 'druid'
      
      if (toon.toLowerCase() === 'guillak')
        return 'warlock'

      return ''
    },
    bossClass(fight) {
      return (fight.kill ? "boss-kill" : "boss-wipe")
    },
    isActive(type) {
      return (type === this.currentCategory) ? "active" : ""
    },
    navigateToLog(id) {
      window.open("https://www.warcraftlogs.com/reports/" + id, '_blank');
    }
  },
  mounted: function() {
    this.$store.dispatch("getAllLogs");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  color: #ccc;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
  display: block;
  margin: 0 0 0.2rem 0;
  padding: 4px 0;
}

button:focus {
  outline: 0;
}

.log-filter {
  margin: 10px 0;
}
.log-filter button {
  background-color: transparent;
  color: #ccc;
  border: none;
  font-size: inherit;
  cursor: pointer;
  padding: 4px 16px;
  border-bottom: 1px solid transparent;
}
.log-filter button.active {
  color: #9482C9;
  border-bottom: 1px solid #9482C9;
}
.log-filter button:hover, .log-filter button.active:hover {
  color: #76a;
  border-bottom: 1px solid #76a;
}
.log-filter button:focus {
  outline: 0;
}
ul.logs-list {
  max-width: 99%;
}
li.log-item {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 100%;
}
li.log-item:nth-child(odd) {
  background-color: #222;
}
li.log-item:nth-child(even) {
  background-color: #1a1a1a;
}
li.log-item:hover {
  background-color: #2a2a2a;
}
.log-date {
  display: flex;
  width: 180px;
  text-align: left;
  padding-left: 20px;
  cursor: pointer;
}
.log-title {
  display: flex;
  width: 700px;
  padding-left: 20px;
  cursor: pointer;
}

.log-details-button {
  display: flex;
  padding: 0 20px;
  width: 120px;
}

.log-details-button button {
  border-radius: 8px;
  background-color: #222;
  color: #ddd;
  border: 1px solid #000;
  margin-bottom: 2px;
  vertical-align: middle;
  padding: 4px 16px;
}

.log-detail {
  border-top: 1px solid #000;
  margin-top: 10px;
  padding: 10px 0 10px 40px;
  background-color: #2a2a2a;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
}
.log-fights {
  display: grid;
  align-self: start;
}
.log-members {
  display: grid;
  align-self: start;
  min-width: 140px;
}
.log-fights li, .log-members li {
  margin: 0;
  padding: 0;
}
.boss-wipe {
  color: #911;
}
.boss-kill {
  color: #191;
}
</style>
