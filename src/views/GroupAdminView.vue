<script setup>
import GroupInfoComponent from '../components/GroupInfoComponent.vue'
import GroupSecretComponent from '../components/GroupSecretComponent.vue'
import GroupExclusionsComponent from '../components/GroupExclusionsComponent.vue'
</script>

<template>
<div class="grid-wrapper">
  <GroupInfoComponent id="GroupInfoComponent"/>
  <GroupSecretComponent id="GroupSecretComponent"/>
</div>
<GroupExclusionsComponent id="GroupExclusionsComponent"/>
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
  
  #GroupExclusionsComponent {
    width: 100%;
    max-width: 600px;
    margin: auto;
  }
</style>