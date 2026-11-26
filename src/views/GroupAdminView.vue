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
<GroupMembersComponent id="GroupMembersComponent" @changed="exclusionsKey++"/>
<GroupExclusionsComponent id="GroupExclusionsComponent" :key="exclusionsKey"/>
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
  
  #GroupMembersComponent,
  #GroupExclusionsComponent {
    width: 100%;
    max-width: 600px;
    margin: auto;
  }
</style>