<!-- Store Tab holds all components for adding and deleting store state and actions.
Functionality:
- Display all actions and states
- Ability to delete any of these
- Ability to create a state and or action in the store directly -->
<template>
  <div class="container">
    <q-card id="store-cards">
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >
        <q-tab name="state" label="Store State" id="label-text" />
        <q-tab name="actions" label="Store Actions" id="label-text" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="html-bg text-white">
        <!-- store state tab -->
        <q-tab-panel name="state">
          <q-input
            @keyup.enter="createNewState(textState)"
            color="white"
            dark
            outlined
            v-model="textState"
            label="Add state to store"
            dense
            class="input-add"
            no-error-icon
            reactive-rules
            :rules="[val => !this.userState.includes(val) || 'A state with this name already exists']"
            @keyup.delete.stop
          >
          <template v-slot:append>
            <q-btn
              flat
              icon="add"
              @click="createNewState(textState)"
            />
          </template>
          </q-input>
          <p v-if="!this.stateOptions.length">No state in store</p>

          <a v-else v-for="state in stateOptions" :key="state">
            <q-list class="list-item" dense bordered separator>
              <q-item clickable v-ripple class="list-item">
                <q-item-section>
                  <div class="component-container">
                    <div class="component-info">
                      {{ state }}
                    </div>
                    <q-btn
                      round 
                      flat icon="highlight_off"
                      class="inner-button"
                      v-on:click.stop="deleteState(state)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </a>
        </q-tab-panel>
        <!-- store actions tab -->
        <q-tab-panel name="actions">
          <!-- creating a new action with input -->
          <q-input
            @keyup.enter="createNewAction(textAction)"
            color="menutext"
            dark
            outlined
            bottom-slots
            v-model="textAction"
            label="Add action to store"
            dense
            class="input-add"
            @keyup.delete.stop
            no-error-icon
            reactive-rules
            :rules="[val => !this.userActions.includes(val) || 'An action with this name already exists']"
          >
            <template v-slot:append>
              <q-btn
                flat
                icon="add"
                @click="createNewAction(textAction)"
              />
            </template>
          </q-input>
          <p v-if="!this.actionOptions.length">No actions in store</p>

          <a v-else v-for="action in actionOptions" :key="action">
            <q-list class="list-item" dense bordered separator>
              <q-item clickable v-ripple class="list-item">
                <q-item-section>
                  <div class="component-container">
                    <div class="component-info">
                      {{ action }}
                    </div>
                    <q-btn
                      round
                      flat
                      icon="highlight_off"
                      v-on:click.stop="deleteAction(action)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </a>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "StoreTab",
  computed: {
    ...mapState(["userActions", "userState"]),
    actionOptions() {
      return this.userActions;
    },
    stateOptions() {
      return this.userState;
    },
  },
  data() {
    return {
      tab: "state",
      textAction: "",
      textState: "",
    };
  },
  methods: {
    ...mapActions([
      "createAction",
      "createState",
      "deleteUserActions",
      "deleteUserState",
    ]),
    // Creates a new action in userActions in the store
    createNewAction(text) {
      if (!this.userActions.includes(text) && text) {
        this.createAction(text);
        this.textAction = "";
      }
    },
    // Creates a new state in userState in the store
    createNewState(text) {
      if (!this.userState.includes(text) && text) {
        this.createState(text);
        this.textState = "";
      }
    },
    // Delete a selected action in the store
    deleteAction(action) {
      // if delete request comes in, send to actions
      this.deleteUserActions(action);
    },
    // Delete a selected state in the store
    deleteState(state) {
      this.deleteUserState(state);
    },
  },
};
</script>

<style lang="scss" scoped>
i {
  font-size: 11px;
}

// styling for the entire Dashboard
.q-footer {
  transition-timing-function: ease-in;
  transition: 0.2s;
  background: $subsecondary;
}

// changes the Dashboard toolbar height
.q-toolbar {
  min-height: 25px !important;
  padding: 0 6px !important;
}

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

// this class selector does not change anything
.q-tab__label {
  // font-size not changing
  font-size: 10px !important;
  line-height: 1.718em;
  font-weight: 500;
}

// changes the tab label styling
#label-text {
  font-size: 4px !important;
  text-transform: capitalize;
}

.q-tab-panel {
  height: 100%;
  // matches the code editor bg
  background: $subprimary;
}

// changes the length of the tab panels
.q-tab-panels {
  height: 100%;
  padding: 0 !important;
}

.q-tabs {
  background: #11120F;
}

#store-cards {
  height: 80%;
  border-radius: 0;
  background: #737578;
}

.html-bg {
  // give html background color of grey
  background-color: #202122;
}

.component-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
