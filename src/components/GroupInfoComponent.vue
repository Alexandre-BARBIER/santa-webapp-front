<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import config from '@config/config.json';

  const route = useRoute()
  const router = useRouter()
  // Destructure the API IP and port from the configuration object
  const { ip, port, protocol } = config.api;
  const apiGroupInfoUrl = `${protocol}://${ip}/api/group/info/${route.params.id}`;
  const apiGroupUpdateUrl = `${protocol}://${ip}/api/group/update`;


  const groupName = ref("")
  const visibility = ref("")
  const join_code = ref("")
  const members = ref()
  const update_code = ref(false)
  const updated_join_code = ref("")

  const readonly = ref(true)

  const loaded = ref(false)

  function toggleDisplay () {
    readonly.value = !readonly.value
  }

  async function requestGroupInfo () {
    await fetch(apiGroupInfoUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        groupName.value = data.name;
        members.value = data.members;
        visibility.value = data.visibility;
        join_code.value = data.join_code;
        loaded.value = true;
      });
    })
    .catch((error) => {
      router.push('/login')
    })
  }

  onMounted(async () => {
    requestGroupInfo();
  })

  async function update_and_back_to_read () {
    await requestGroupUpdate();
    await requestGroupInfo();
    toggleDisplay();
  }

  function fetch_and_back_to_read () {
    toggleDisplay();
    requestGroupInfo();
  }

  async function requestGroupUpdate () {
  // event.preventDefault()
    
    await fetch(apiGroupUpdateUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        groupID: route.params.id,
        visibility: visibility.value,
        groupName: groupName.value,
        update_code: update_code.value,
        join_code: updated_join_code.value // pass the URL to the backend
      })
    })
    .catch(err => console.error(err))
  }

</script>

<template>
<Transition>
  <form v-if="loaded" @submit.prevent="update_and_back_to_read">
    <fieldset v-if="readonly" >
      <legend>Group Info</legend>
      <div class="grid-wrapper">
        <span>Group Name</span> <span>{{groupName}}</span>
        <span>Visibility</span> <span>{{visibility}}</span>
        <span>Join Code</span> <span>{{join_code}}</span>
      </div>
      <span>Members : </span>
      <li v-for="member in members">
        {{ member }}
      </li>
      <button @click="toggleDisplay" class="action">Modify</button>

    </fieldset>
    <fieldset v-else>
      <legend>Group Info</legend>
      <div class="form-wrapper grid-wrapper">
        <label for="groupName">Group name*</label>
        <input required :class="{ wrong: !groupName }" autocomplete="off" placeholder="Enter a Group Name" id="groupName" name="groupName" type="text" v-model="groupName">

        <label for="visibility_switch" class="switch">Protected</label>
        <label class="switch">
          <input type="checkbox" id="visibility_switch" v-model="visibility" true-value="protected" false-value="public">
          <span class="slider round"></span>
        </label>

        <label for="update_join_code_switch" >Edit Code</label>
        <label class="switch">
          <input type="checkbox" id="update_join_code_switch" v-model="update_code" true-value="true" false-value="false">
          <span class="slider round"></span>
        </label>
      <Transition>
        <label v-if="update_code=='true'" for="updated_join_code">Join Code</label>
      </Transition>
      <Transition>
        <input v-if="update_code=='true'" autocomplete="off" placeholder="Enter a Join Code" id="updated_join_code" name="updated_join_code" type="text" v-model="updated_join_code">
      </Transition>
      </div>
      
      <div class="row-flex-wrapper">
      <button type="submit">Update!</button>
      <button @click="fetch_and_back_to_read" class="cancel">Cancel</button>

      </div>


    </fieldset>
  </form>
  </Transition>
</template>

<style scoped>
  .grid-wrapper:not(.modify) {
    margin: 0.5em;
    border-radius: 0.3em;
    gap: 0;
  }
  
  .grid-wrapper > span {
    padding: 0.25em 0.8em;
  }

  .grid-wrapper > label {
    padding: 0.25em 0.8em;
    margin: 0.5em;
    justify-self: start;
  }


  nav {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  nav > a {
    padding: 0.1em 0.5em;
    border-radius: 0.5em;
  }

  a.forgot-password-link {
    color: crimson;
  }

  a.forgot-password-link:hover {
    background-color: rgba(220, 20, 60, 0.1);
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

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

#update_join_code_switch:checked + .slider {
  background-color: rgb(184, 9, 9);;
}

#update_join_code_switch:focus + .slider {
  box-shadow: 0 0 1px rgb(184, 9, 9);;
}

#update_join_code_switch:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
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
</style>