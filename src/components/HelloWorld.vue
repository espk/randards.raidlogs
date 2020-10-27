<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="log in logs" v-bind:key="log.id">
        <span class="log-date">{{ log.startDate.toLocaleDateString('en-us') }}</span> 
        <span class="log-title">{{log.title}} ({{ log.owner }})</span>
        <span class="log-details-button"><button @click="logDetails(log.id)">view details</button></span>
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
  name: 'HelloWorld',
  props: {
    msg: String
  },
  store,
  computed: mapState(["logs", "detailId", "details", "detailsLoaded"]),
  methods: {
    logDetails: function(id) {
      this.$store.commit("updateLogId", id)
      this.$store.dispatch("loadDetails", id)
    },
    isCurrentLog: function(id) {
      return (this.detailId === id)
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
