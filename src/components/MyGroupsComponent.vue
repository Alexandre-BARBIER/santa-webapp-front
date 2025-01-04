<script setup>
// TODO: emits form
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const ip = import.meta.env.API_HOST
  const protocol = import.meta.env.API_PROTOCOL
  const api_My_Groups_Url = `${protocol}://${ip}/api/mygroups`;            //GET
  const api_Leave_Group_Url = `${protocol}://${ip}/api/group/leave`;       //POST : request.get_json()['groupID']   

  
  const my_groups = ref([])
  const loaded = ref(false)

  async function RequestMyGroups() {
    const response = await fetch(api_My_Groups_Url, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        my_groups.value = data;
        loaded.value = true;
      });
    })
    .catch((error) => {
      router.push('/login')
    })
  }

  onMounted(async () => {
    await RequestMyGroups()
  })

async function quitGroup(groupID) {
    await fetch(api_Leave_Group_Url, {
      withCredntials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        groupID: groupID
      })
    })
    await RequestMyGroups()
}

function redirect_to_group(groupID) {
  router.push((`/gift/group/${groupID}`))
}

</script>

<template>
  <Transition>
    <form v-if="loaded" @submit.prevent="update_and_back_to_read">
        <div v-if="my_groups.length > 0">
          <table class="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Secret Santa</th>
                <th>Leave</th>
              </tr>
            </thead>
            <tbody>
              <tr id="group_button" v-for="group in my_groups" :key="group.id">
                <td @click="redirect_to_group(group.id)">{{group.id}}</td>
                <td @click="redirect_to_group(group.id)">{{group.name}}</td>
                <td @click="redirect_to_group(group.id)">{{group.secret_santa}}</td>
                <td><button class="leave-group-btn" @click="quitGroup(group.id)">Leave Group</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>You don't belong to any groups.</p>
        </div>
    </form>
  </Transition>
</template>


<style scoped>
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

.leave-group-btn {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #dc3545; /* Red color */
  color: #fff; /* White text color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.leave-group-btn:hover {
  background-color: #c82333; /* Darker red color on hover */
}

#group_button {
  cursor: pointer;
  text-decoration: underline;
  color: var(--color-text);
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 0; 
}
#group_button:hover {
  background-color: rgb(21, 92, 0);
  border-radius: 15px;
  color: white;
  transform: scale(0.98);
  font-size: 1.0em;
  transition: all 0.3s ease;
}

</style>