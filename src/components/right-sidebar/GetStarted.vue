<template>
  <q-card id="dashboard-cards">
    <q-tabs
      v-model="tutorialPage"
      class="bg-subaccent text-white"
      active-color="secondary"
      indicator-color="secondary"
      align="left"
      dense
      breakpoint="950"
    >
      <q-tab
        name="landing"
        label="Welcome to OverVue"
        id="label-text"
        >
      </q-tab>
      <q-tab 
        name="basics" 
        label="The Basics" 
        id="label-text"
        >
      </q-tab>
      <q-tab 
        name="advanced" 
        label="Advanced Functionality" 
        id="label-text"
        >
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="tutorialPage" animated>
      <q-tab-panel name="landing">
        <Landing @nextTab="tutorialPage = 'basics'"/>
      </q-tab-panel>
      <q-tab-panel name="basics">
        <BasicFunctions @nextTab="tutorialPage = 'advanced'"/>
      </q-tab-panel>
      <q-tab-panel name="advanced">
        <AdvancedFunctions />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import BasicFunctions from './tutorial/BasicFunctions.vue'
import AdvancedFunctions from './tutorial/AdvancedFunctions.vue'
import Landing from './tutorial/Landing.vue'

export default {
  components: {
    BasicFunctions,
    AdvancedFunctions,
    Landing,
  },
  data(){
    return {
      tutorialPage: 'landing'
    }
  }
}

</script>

<style lang="scss" scoped>

.q-btn {
  font-size: 8px;
  margin: 5px;
}

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

/* this class selector does not change anything */
.q-tab__label {
  /* // font-size not changing */
  font-size: 10px !important;
  line-height: 1.718em;
  font-weight: 500;
}

/* // changes the tab label styling */
#label-text {
  font-size: 4px !important;
  text-transform: capitalize;
}

.q-tab-panel {
  /* // matchs the code editor bg */
  background: $subprimary;
}

.q-tab-panels {
  padding: 0px !important;
  background: $subprimary;
}

.q-tabs {
  background: $subprimary;
}

.inner-div {
  height: 100%;
}

</style>