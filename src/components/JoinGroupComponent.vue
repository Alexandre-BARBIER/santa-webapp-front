<script setup>
  import { ref } from 'vue'

  const ip = import.meta.env.API_HOST
  const protocol = import.meta.env.API_PROTOCOL
  const apiJoinGroupUrl = `${protocol}://${ip}/api/group/join`;

  const group_id = ref("")
  const input_code = ref("")
  const resultMessage = ref("");
  const resultColor = ref("");

  const emit = defineEmits(['groupJoined']); // Define the custom event

  async function JoinGroup () {
    
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
        groupID: group_id.value,
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
  <form @submit.prevent="JoinGroup">
    <fieldset>
      <legend>Join a Group</legend>
      <div class="form-wrapper grid-wrapper">
          <label for="group_id_input">Group ID</label>
          <input required autocomplete="off" placeholder="Enter the ID of the group" id="group_id_input" name="group_id" type="text" v-model="group_id">
          <label for="input_code_input">Join Code</label>
          <input autocomplete="off" placeholder="Enter the Join Code if needed" id="input_code_input" name="input_code" type="text" v-model="input_code">
      </div>
      
      <button type="submit">Join !</button>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
    </fieldset>
  </form>
</template>