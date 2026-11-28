<script setup>
// TODO: emits form
  import { ref, onMounted, computed } from 'vue'
  import config from '@config/config.json';;
  import { useRouter } from 'vue-router'

  const router = useRouter()
  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
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
              <tr class="clickable-row" v-for="group in my_groups" :key="group.id">
                <td @click="redirect_to_group(group.id)">{{group.id}}</td>
                <td @click="redirect_to_group(group.id)">{{group.name}}</td>
                <td @click="redirect_to_group(group.id)">{{group.secret_santa}}</td>
                <td><button type="button" class="delete" @click="quitGroup(group.id)">Leave Group</button></td>
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
