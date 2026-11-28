<script setup>
   import{ ref, onMounted, computed } from 'vue'
  import config from '@config/config.json';
  import { useRouter } from 'vue-router'

  const router = useRouter()
  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const api_My_Admin_Groups_Url = `${protocol}://${ip}/api/group/admin`;     //GET
  const api_Delete_Group_Url = `${protocol}://${ip}/api/group/delete`;       //DELETE : request.get_json()['groupID']   
  
  const my_admin_groups = ref([])
  const loaded = ref(false)

  async function RequestMyAdminGroups() {
    const response = await fetch(api_My_Admin_Groups_Url, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        my_admin_groups.value = data;
        loaded.value = true;
      });
    })
    .catch((error) => {
      router.push('/login')
    })
  }

  onMounted(async () => {
    await RequestMyAdminGroups()
  })

async function deleteGroup(groupID) {
    await fetch(api_Delete_Group_Url, {
      withCredntials: true,
      credentials: 'include',
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        groupID: groupID
      })
    })
    await RequestMyAdminGroups()
}

function redirect_to_admin_group(groupID) {
  router.push((`/group/admin/${groupID}`))
}

</script>

<template>
  <Transition>
    <form v-if="loaded" @submit.prevent="update_and_back_to_read">
        <div v-if="my_admin_groups.length > 0">
          <table class="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Secret Santa</th>
                <th>Visibility</th>
                <th>Join Code</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr class="clickable-row" v-for="admin_group in my_admin_groups" :key="admin_group.id">
                <td @click="redirect_to_admin_group(admin_group.id)">{{admin_group.id}}</td>
                <td @click="redirect_to_admin_group(admin_group.id)">{{admin_group.name}}</td>
                <td @click="redirect_to_admin_group(admin_group.id)">{{admin_group.secret_santa}}</td>
                <td @click="redirect_to_admin_group(admin_group.id)">{{admin_group.visibility}}</td>
                <td @click="redirect_to_admin_group(admin_group.id)">{{admin_group.join_code}}</td>
                <td><button type="button" class="delete" @click="deleteGroup(admin_group.id)">Delete Group</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>You didn't create any groups.</p>
        </div>
    </form>
  </Transition>
</template>
