<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import config from '@config/config.json';

  const route = useRoute()
  const router = useRouter()
  
  const { ip, protocol } = config.api;
  const apiExclusionsUrl = `${protocol}://${ip}/api/exclusions/group/${route.params.id}`;
  const apiAddExclusionUrl = `${protocol}://${ip}/api/exclusions/add`;
  const apiDeleteExclusionUrl = `${protocol}://${ip}/api/exclusions/delete`;
  const apiGroupInfoUrl = `${protocol}://${ip}/api/group/info/${route.params.id}`;

  const exclusions = ref([])
  const members = ref([])
  const selectedUser = ref('')
  const selectedExcludedUser = ref('')
  const resultMessage = ref("");
  const resultColor = ref("");
  const loaded = ref(false)

  async function requestExclusions() {
    await fetch(apiExclusionsUrl, {
      withCredentials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        if (data.status === 'OK') {
          exclusions.value = data.exclusions;
        } else {
          resultMessage.value = data.status;
          resultColor.value = 'red';
        }
        loaded.value = true;
      });
    })
    .catch((error) => {
      router.push('/login')
    });
  }

  async function requestGroupInfo() {
    await fetch(apiGroupInfoUrl, {
      withCredentials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        if (data.status === 'OK') {
          members.value = data.members
        }
      });
    })
    .catch((error) => {
      router.push('/login')
    });
  }

  async function addExclusion() {
    if (!selectedUser.value || !selectedExcludedUser.value) {
      resultMessage.value = "Please select both users";
      resultColor.value = 'red';
      return;
    }

    if (selectedUser.value === selectedExcludedUser.value) {
      resultMessage.value = "A user cannot exclude themselves";
      resultColor.value = 'red';
      return;
    }

    await fetch(apiAddExclusionUrl, {
      withCredentials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupID: route.params.id,
        userID: selectedUser.value,
        excludedUserID: selectedExcludedUser.value
      })
    })
    .then((response) => {
      response.json().then((data) => {
        resultMessage.value = data.status;
        resultColor.value = data.status === 'Exclusion added' ? 'green' : 'red';
        if (data.status === 'Exclusion added') {
          requestExclusions();
        }
      });
    });
  }

  async function deleteExclusion(exclusionID) {
    await fetch(apiDeleteExclusionUrl, {
      withCredentials: true,
      credentials: 'include',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exclusionID: exclusionID
      })
    })
    .then((response) => {
      response.json().then((data) => {
        resultMessage.value = data.status;
        resultColor.value = data.status === 'Exclusion deleted' ? 'green' : 'red';
        if (data.status === 'Exclusion deleted') {
          requestExclusions();
        }
      });
    });
  }

  onMounted(async () => {
    await requestGroupInfo();
    await requestExclusions();
  });
</script>

<template>
  <Transition>
    <form v-if="loaded">
      <fieldset>
        <legend>Secret Santa Exclusions</legend>
        <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
        
        <p>Add exclusions to prevent certain members from being paired with each other.</p>
        
        <div class="form-wrapper grid-wrapper">
          <label for="userSelect">User</label>
          <select v-model="selectedUser" id="userSelect">
            <option value="">Select a user</option>
            <option v-for="member in members" :key="member.id" :value="member.id">{{ member.login }}</option>
          </select>
          
          <label for="excludedUserSelect">Cannot give a gift to</label>
          <select v-model="selectedExcludedUser" id="excludedUserSelect">
            <option value="">Select a user</option>
            <option v-for="member in members" :key="member.id" :value="member.id">{{ member.login }}</option>
          </select>
        </div>
        
        <button type="button" @click="addExclusion" class="action">Add Exclusion</button>
        
        <div v-if="exclusions.length > 0">
          <h3>Current Exclusions</h3>
          <table class="styled-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Cannot give a gift to</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exclusion in exclusions" :key="exclusion.id">
                <td>{{ exclusion.userName }}</td>
                <td>{{ exclusion.excludedUserName }}</td>
                <td>
                  <button class="delete" @click="deleteExclusion(exclusion.id)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>No exclusions have been set up yet.</p>
        </div>
        
        <div class="info-box">
          <h4>Note</h4>
          <p>If you add too many exclusions, it may be impossible to create valid pairings for your Secret Santa. In that case, you'll receive an error when trying to start the Secret Santa.</p>
        </div>
      </fieldset>
    </form>
  </Transition>
</template>

<style scoped>
  .info-box {
    margin-top: 1em;
    padding: 1em;
    background-color: rgba(230, 230, 230, 0.3);
    border-radius: 0.5em;
    border: 1px solid rgba(200, 200, 200, 0.5);
  }
  
  .info-box h4 {
    margin-top: 0;
    color: var(--color-text);
  }
  
  select {
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
</style>