<script setup>
  import { ref } from 'vue'
  import config from '@config/config.json';

  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const api_JoinGroup_Url = `${protocol}://${ip}/api/group/create`;

  const group_name = ref("")
  const visibility = ref("public") // Set default visibility
  const join_code = ref("");
  const resultMessage = ref("");
  const resultColor = ref("");

  const emit = defineEmits(['groupCreated']); // Define the custom event

  async function CreateGroup(event) {
    const response = await fetch(api_JoinGroup_Url, {
      withCredentials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupName: group_name.value,
        visibility: visibility.value,
        join_code: join_code.value,
      })
    });

    response.text().then((data) => {
      resultMessage.value = 'Group successfully created.';
      resultColor.value = 'green';
      emit('groupCreated', '');
    });

    return response;
  }
</script>

<template>
  <form @submit.prevent="CreateGroup">
    <fieldset>
      <legend>Create a Group</legend>
      <div class="form-wrapper grid-wrapper">
        <label for="group_name_input">Group Name</label>
        <input required autocomplete="off" placeholder="Enter the name of the new group" id="group_name_input" name="group_name" type="text" v-model="group_name">

        <label for="input_code_input">Join Code</label>
        <input autocomplete="off" placeholder="Enter a Join Code if needed" id="input_code_input" name="input_code" type="text" v-model="join_code">  
        
        <label for="visibility_switch">Protected</label>
        <label class="switch">
          <input type="checkbox" id="visibility_switch" v-model="visibility" true-value="protected" false-value="public">
          <span class="slider"></span>
        </label>

        
      </div>
      
      <button type="submit">Create !</button>
      <div v-if="resultMessage" class="alert" :class="`alert-${resultColor}`">{{ resultMessage }}</div>
    </fieldset>
  </form>
</template>
