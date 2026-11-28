<script setup>
import JoinGroupComponent from '../components/JoinGroupComponent.vue'
import CreateGroupComponent from '../components/CreateGroupComponent.vue'
import MyGroupsComponent from '../components/MyGroupsComponent.vue'
import GroupAdminComponent from '../components/GroupAdminComponent.vue'
</script>

<template>
    <JoinGroupComponent @groupJoined="handleGroupJoined" />
    <CreateGroupComponent @groupCreated="handleGroupJoined"/>
    <div class="tabview">
    <fieldset>
    <div>
      <div class="tab-container">
        <button type="button" class="tab" :class="{ 'active-tab': selectedTab === 'mygroups' }" @click="selectedTab = 'mygroups'">My Groups</button>
        <button type="button" class="tab" :class="{ 'active-tab': selectedTab === 'groupadmin' }" @click="selectedTab = 'groupadmin'">Group Administration</button>
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

<style scoped>
.tab-container {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background-color: var(--color-info-bg);
  border-radius: var(--radius-pill);
  width: 100%;
  margin-bottom: 1rem;
}

.tab {
  flex: 1;
  background-color: transparent;
  border: none;
  color: var(--color-text-muted);
  padding: 0.55em 1.2em;
  border-radius: var(--radius-pill);
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s;
}

.tab:hover {
  color: var(--color-text);
}

.active-tab,
.active-tab:hover {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}
</style>
