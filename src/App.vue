<template>
  <div id="app">
    <warcraft-logs msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import WarcraftLogs from './components/WarcraftLogs.vue'

export default {
  name: 'App',
  components: {
    WarcraftLogs
  }
}
</script>

<style>
main {
  font-size: 1.5rem;
}
</style>
