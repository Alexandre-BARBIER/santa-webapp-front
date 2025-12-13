<script setup>
import JoinGroupComponent from '../components/JoinGroupComponent.vue'
import CreateGroupComponent from '../components/CreateGroupComponent.vue'
import MyGroupsComponent from '../components/MyGroupsComponent.vue'
import GroupAdminComponent from '../components/GroupAdminComponent.vue'
</script>

<template>
    <JoinGroupComponent @groupJoined="handleGroupJoined" />
    <CreateGroupComponent @groupCreated="handleGroupJoined"/>
    <br><br>
    <div class="tabview">
    <fieldset>
    <div>
      <div class="tab-container">
        <button class="tab" :class="{ 'active-tab': selectedTab === 'mygroups' }" @click="selectedTab = 'mygroups'">My Groups</button>
        <button class="tab" :class="{ 'active-tab': selectedTab === 'groupadmin' }" @click="selectedTab = 'groupadmin'">Group Administration</button>
      </div>
      <div>
        <component :is="selectedTab === 'mygroups' ? 'my-groups' : 'group-admin'" :key="reloadKey"></component>
    </div>
  </div>
</fieldset>
</div>
</template>


<script>
export default {
  components: {
    'my-groups': MyGroupsComponent,
    'group-admin': GroupAdminComponent,
  },
  data() {
    return {
      selectedTab: 'mygroups',
      reloadKey: 0,
    };
  },
  methods: {
    handleGroupJoined(message) {
      this.reloadKey++;
    },
  },
};
</script>

<style>
h1 {
  text-align: center;
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  text-align: center;
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}


.tab-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.tab {
  background-color: rgb(144, 20, 20);
  border: none;
  color: lightgrey;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 12px 12px 0 0;
  width: calc(50% - 2px); /* Subtracting 2px to account for border width */
}

.tab:hover {
  color: white;
}

.active-tab {
  background-color: rgb(210, 9, 9);
  color: white;
}

.active-tab:hover {
  background-color: rgb(230, 60, 60);
  color: white;
}
</style>