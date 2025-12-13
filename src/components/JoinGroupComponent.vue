<script setup>
  import { ref, onMounted, computed } from 'vue'
  import config from '@config/config.json';

  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const apiJoinGroupUrl = `${protocol}://${ip}/api/group/join`;
  const apiAllGroupsUrl = `${protocol}://${ip}/api/group/all`;

  const loaded = ref(false)
  const groups = ref([])
  const selectedGroup = ref("")
  const input_code = ref("")
  const resultMessage = ref("");
  const resultColor = ref("");
  const loading = ref(true)

  const emit = defineEmits(['groupJoined']); // Define the custom event

  // Computed property to determine if the selected group is protected
  const isProtectedGroup = computed(() => {
    if (!selectedGroup.value) return false;
    const group = groups.value.find(g => g.id.toString() === selectedGroup.value.toString());
    return group && group.visibility === 'protected';
  });

  // Fetch all available groups when component is mounted
  onMounted(async () => {
    await fetchGroups();
  });

  async function fetchGroups() {
    loading.value = true;
    try {
      const response = await fetch(apiAllGroupsUrl, {
        withCredentials: true,
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        groups.value = await response.json();
      } else {
        console.error('Failed to fetch groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      loading.value = false;
    }
    loaded.value = true
  }

  async function JoinGroup() {
    if (!selectedGroup.value) {
      resultMessage.value = "Please select a group";
      resultColor.value = "red";
      return;
    }
    
    if (isProtectedGroup.value && !input_code.value) {
      resultMessage.value = "This group requires a join code";
      resultColor.value = "red";
      return;
    }
    
    const response = await fetch(apiJoinGroupUrl, {
      withCredentials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        groupID: selectedGroup.value,
        join_code: input_code.value,
      })
    });

    response.text().then((data) => {
        let color = '';
        let message = ''
        switch (data) {
            case 'Group joined':
                color = 'green';
                message = 'Group successfully joined.';
                // Emit the custom event
                emit('groupJoined', '');
                // Reset inputs
                selectedGroup.value = "";
                input_code.value = "";
                break;
            case 'Failed to join group':
                color = 'red';
                message = 'Failed to join group.';
                break;
            case 'Invalid group ID':
                color = 'dodgerblue';
                message = 'Invalid group ID';
                break;
            case 'Already in group':
                color = 'blue';
                message = 'You are already in this group.';
                break;
            case 'Unknown group':
                color = 'orange';
                message = 'Group does not exist.';
                break;
            default:
                color = 'black';
                message = 'Unexpected response.';
        }
        resultMessage.value = message;
        resultColor.value = color;
    });
    
    return response;
  }
</script>

<template>
  <Transition>
  <form v-if="loaded" @submit.prevent="JoinGroup">
    <fieldset>
      <legend>Join a Group</legend>
      <div v-if="loading" class="loading-spinner">Loading groups...</div>
      <div v-else class="form-wrapper grid-wrapper">
        <label for="group_select">Select Group</label>
        <select id="group_select" v-model="selectedGroup" class="group-select">
          <option value="">-- Select a group --</option>
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }} {{ group.visibility === 'protected' ? '(Protected)' : '' }}
          </option>
        </select>
        
        <template v-if="isProtectedGroup">
          <label for="input_code_input">Join Code</label>
          <input autocomplete="off" placeholder="Enter the Join Code" id="input_code_input" name="input_code" type="text" v-model="input_code">
        </template>
      </div>
      
      <button type="submit" :disabled="loading">Join!</button>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
    </fieldset>
  </form>
  </Transition>
</template>

<style scoped>
.loading-spinner {
  text-align: center;
  margin: 1em 0;
  color: var(--color-text);
}

.group-select {
  width: var(--input-width);
  padding: 0.5em 1em;
  border: solid rgba(0,0,0,0) var(--input-border-outline);
  outline: solid rgba(128, 128, 128, 0.5) var(--input-border-outline);
  border-radius: 2em;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
/* Add any additional styles you need */
</style>