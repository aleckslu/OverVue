<template>
<!--Landing page-->
  <section id="welcomeTab">
  <h6 class="tutorialHeading">Welcome to</h6>
  <img alt="OverVue" src="../../../assets/overvue_layeredlogo.png" id="logo">
      <q-btn
      class="tut-btn"
      color="secondary"
      label="What's New in 6.0"
      @click="openUrl('https://github.com/open-source-labs/OverVue#changelog-50')"
    />
          <q-btn
      class="tut-btn"
      color="secondary"
      label="View the Readme"
      @click="openUrl('https://github.com/open-source-labs/OverVue#readme')"
    />
    <p id="new-text">New to OverVue?</p>
    <q-btn
      class="tut-btn"
      color="secondary"
      label="Explore Functionality"
      @click="nextTab"
    />
    <p id="new-text"></p>
      <q-btn
      class="tut-btn closeAction"
      label="Close"
      @click="toggleTutorial"
    />
  </section>
</template>

<script>
const { ipcRenderer, shell } = window;
import { mapActions } from 'vuex';
export default {
  emits: ['nextTab'],
  methods: {
    ...mapActions(["toggleTutorial"]),
    nextTab(){
      this.$emit('nextTab')
    },
    openUrl(url){
      shell.openExternal(url, { activate: true });
    }
  }
}
</script>

<style lang="scss" scoped>
#logo{
  width: 325px;
  height: 325px;
}


p{
  margin-top: 12px;
  margin-bottom: 0px;
}
#welcomeTab{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tutorialHeading {
  margin: .75rem;
  font-size: 2rem;
  padding-top: 15px;
}

.tutorialContent {
  margin: .75rem;
}

.tut-btn {
  margin: 0.75rem;
  width: 50%;
  min-height: 42px;
  height: auto;
}

</style>
