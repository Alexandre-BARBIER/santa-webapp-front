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
<div class="admin-grid">
  <GroupInfoComponent id="GroupInfoComponent"/>
  <GroupSecretComponent id="GroupSecretComponent"/>
  <GroupMembersComponent id="GroupMembersComponent" @changed="exclusionsKey++"/>
  <GroupExclusionsComponent id="GroupExclusionsComponent" :key="exclusionsKey"/>
</div>
</template>

<style scoped>
  /* 2x2 grid: info | secret santa, then members | exclusions. Cards of a row share the same height.
     Single column (in that same order) when there is no room for two. */
  .admin-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.75rem 1.75rem;
    max-width: 1100px;
    margin: 1.5rem auto;
  }

  /* The component roots are <form>s: let their card fill the grid cell */
  .admin-grid > form {
    margin: 0;
    align-items: stretch;
    min-width: 0;
  }

  .admin-grid > form :deep(fieldset) {
    flex: 1;
    width: 100%;
  }

  /* Cards are narrower than a standalone form: shrink the controls so they fit */
  @media (min-width: 481px) {
    .admin-grid {
      --input-width: 17em;
    }
  }

  @media (max-width: 900px) {
    .admin-grid {
      grid-template-columns: minmax(0, 1fr);
      max-width: 600px;
    }
  }
</style>
