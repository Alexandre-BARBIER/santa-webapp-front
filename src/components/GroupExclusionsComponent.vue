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
        <div v-if="resultMessage" class="alert" :class="`alert-${resultColor}`">{{ resultMessage }}</div>
        
        <p class="instructions">Add exclusions to prevent certain members from being paired with each other.</p>
        
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
        
        <div v-if="exclusions.length > 0" class="table-wrapper">
          <h3>Current Exclusions</h3>
          <table class="styled-table full-width">
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
                  <button type="button" class="delete" @click="deleteExclusion(exclusion.id)">Remove</button>
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
  .instructions {
    margin-bottom: 2em; /* Add vertical space after the instructions text */
  }
  
  .info-box {
    margin-top: 1em;
    padding: 1em;
    background-color: var(--color-info-bg);
    border-radius: var(--radius);
    border: 1px solid var(--color-border);
  }
  
  .info-box h4 {
    margin-top: 0;
  }
  
  /* Stack each label above its select: side by side they overflow a half-width card */
  .form-wrapper.grid-wrapper {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: 0.35rem;
  }

  .form-wrapper.grid-wrapper > label {
    justify-self: center;
  }

  .form-wrapper.grid-wrapper > label:not(:first-child) {
    margin-top: 0.5rem;
  }

  .table-wrapper {
    align-self: stretch;
    overflow-x: auto;
  }

  .table-wrapper h3 {
    text-align: center;
  }

  /* .styled-table is display:block, so the real table inside only shrinks to its content */
  .styled-table.full-width {
    display: table;
    width: 100%;
    min-width: 0;
  }
</style>
