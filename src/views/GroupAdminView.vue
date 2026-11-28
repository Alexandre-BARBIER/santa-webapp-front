<script setup>
import { ref } from 'vue'
import GroupInfoComponent from '../components/GroupInfoComponent.vue'
import GroupSecretComponent from '../components/GroupSecretComponent.vue'
import GroupMembersComponent from '../components/GroupMembersComponent.vue'
import GroupExclusionsComponent from '../components/GroupExclusionsComponent.vue'

// Exclusions pick their users among the members: reload them when the members change
const exclusionsKey = ref(0)
</script>

<template>
<div class="grid-wrapper">
  <GroupInfoComponent id="GroupInfoComponent"/>
  <GroupSecretComponent id="GroupSecretComponent"/>
</div>
<div class="panels">
  <GroupMembersComponent id="GroupMembersComponent" @changed="exclusionsKey++"/>
  <GroupExclusionsComponent id="GroupExclusionsComponent" :key="exclusionsKey"/>
</div>
</template>

<style scoped>
  .grid-wrapper {
    border-radius: 0.3em;
    gap: 0;
    padding: 0.25em 0.8em;
  }
  #GroupInfoComponent {
    justify-self: end;
  }

  #GroupSecretComponent {
    justify-self: start;
  }
  
  /* Side by side when there is room, stacked (members first) otherwise */
  .panels {
    gap: 0 1.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
  }

  #GroupMembersComponent,
  #GroupExclusionsComponent {
    flex: 1 1 420px;
    max-width: 600px;
  }
</style>