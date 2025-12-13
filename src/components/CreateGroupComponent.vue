<script setup>
  import { ref } from 'vue'
  import config from '@config/config.json';

  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const api_JoinGroup_Url = `${protocol}://${ip}/api/group/create`;

  const loaded = ref(false)
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

  loaded.value = true
</script>

<template>
  <Transition>
  <form v-if="loaded" @submit.prevent="CreateGroup">
    <fieldset>
      <legend>Create a Group</legend>
      <div class="form-wrapper grid-wrapper">
        <label for="group_name_input">Group Name</label>
        <input required autocomplete="off" placeholder="Enter the name of the new group" id="group_name_input" name="group_name" type="text" v-model="group_name">

        <label for="input_code_input">Join Code</label>
        <input autocomplete="off" placeholder="Enter a Join Code if needed" id="input_code_input" name="input_code" type="text" v-model="join_code">  
        
        <label for="visibility_switch" class="switch">Protected</label>
        <label class="switch">
          <input type="checkbox" id="visibility_switch" v-model="visibility" true-value="protected" false-value="public">
          <span class="slider round"></span>
        </label>

        
      </div>
      
      <button type="submit">Create !</button>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
    </fieldset>
  </form>
  </Transition>
</template>

<style>
 /* The switch - the box around the slider */
 .switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

#visibility_switch:checked + .slider {
  background-color: rgb(184, 9, 9);;
}

#visibility_switch:focus + .slider {
  box-shadow: 0 0 1px rgb(184, 9, 9);;
}

#visibility_switch:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

@media (max-width: 640px) {
  .switch {
    width: 50px;
    height: 28px;
  }

  .slider:before {
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 3px;
  }

  #visibility_switch:checked + .slider:before {
    transform: translateX(22px);
  }
}

@media (max-width: 480px) {
  .switch {
    width: 45px;
    height: 25px;
  }

  .slider:before {
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
  }

  #visibility_switch:checked + .slider:before {
    transform: translateX(19px);
  }
  
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}
</style>
