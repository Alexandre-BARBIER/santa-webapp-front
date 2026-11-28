<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import config from '@config/config.json';

  const emit = defineEmits(['changed'])

  const route = useRoute()
  const router = useRouter()

  const { ip, protocol } = config.api;
  const apiGroupInfoUrl = `${protocol}://${ip}/api/group/info/${route.params.id}`;           //GET
  const apiCandidatesUrl = `${protocol}://${ip}/api/group/candidates/${route.params.id}`;    //GET ?q=
  const apiAddMemberUrl = `${protocol}://${ip}/api/group/member/add`;                        //POST   : groupID, userID
  const apiRemoveMemberUrl = `${protocol}://${ip}/api/group/member/remove`;                  //DELETE : groupID, userID
  const apiInviteUrl = `${protocol}://${ip}/api/group/invite`;                               //POST   : groupID, email
  const apiInvitationsUrl = `${protocol}://${ip}/api/group/invitations/${route.params.id}`;  //GET
  const apiCancelInvitationUrl = `${protocol}://${ip}/api/group/invitation/cancel`;          //DELETE : invitationID

  const SEARCH_DELAY_MS = 250

  const members = ref([])
  const search = ref('')
  const candidates = ref([])
  const selectedCandidate = ref(null)
  const dropdownOpen = ref(false)
  const resultMessage = ref('')
  const resultColor = ref('')
  const inviteEmail = ref('')
  const invitations = ref([])
  const loaded = ref(false)

  let searchTimer = null
  let searchCounter = 0

  async function requestMembers() {
    await fetch(apiGroupInfoUrl, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'OK') {
        members.value = data.members;
      } else {
        resultMessage.value = data.status;
        resultColor.value = 'red';
      }
      loaded.value = true;
    })
    .catch(() => {
      router.push('/login')
    });
  }

  async function requestCandidates() {
    const currentSearch = ++searchCounter;
    await fetch(`${apiCandidatesUrl}?q=${encodeURIComponent(search.value)}`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      // Ignore answers of outdated searches
      if (currentSearch === searchCounter && data.status === 'OK') {
        candidates.value = data.users;
      }
    })
    .catch(() => {
      candidates.value = [];
    });
  }

  function onSearchInput() {
    selectedCandidate.value = null;
    dropdownOpen.value = true;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(requestCandidates, SEARCH_DELAY_MS);
  }

  function openDropdown() {
    dropdownOpen.value = true;
    requestCandidates();
  }

  function closeDropdown() {
    dropdownOpen.value = false;
  }

  function selectCandidate(candidate) {
    selectedCandidate.value = candidate;
    search.value = candidate.login;
    dropdownOpen.value = false;
  }

  async function addMember() {
    if (!selectedCandidate.value) {
      resultMessage.value = 'Please select a user in the list';
      resultColor.value = 'red';
      return;
    }

    await fetch(apiAddMemberUrl, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupID: route.params.id,
        userID: selectedCandidate.value.id
      })
    })
    .then((response) => response.json())
    .then(async (data) => {
      resultMessage.value = data.status;
      resultColor.value = data.status === 'Member added' ? 'green' : 'red';
      if (data.status === 'Member added') {
        search.value = '';
        selectedCandidate.value = null;
        await requestMembers();
        emit('changed');
      }
    });
  }

  async function removeMember(member) {
    if (!window.confirm(`Remove ${member.login} from the group?`)) {
      return;
    }

    await fetch(apiRemoveMemberUrl, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupID: route.params.id,
        userID: member.id
      })
    })
    .then((response) => response.json())
    .then(async (data) => {
      resultMessage.value = data.status;
      resultColor.value = data.status === 'Member removed' ? 'green' : 'red';
      if (data.status === 'Member removed') {
        await requestMembers();
        emit('changed');
      }
    });
  }

  async function requestInvitations() {
    await fetch(apiInvitationsUrl, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'OK') {
        invitations.value = data.invitations;
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  async function inviteMember() {
    const email = inviteEmail.value.trim();
    if (!email) {
      resultMessage.value = 'Please enter an email';
      resultColor.value = 'red';
      return;
    }

    await fetch(apiInviteUrl, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupID: route.params.id,
        email: email
      })
    })
    .then((response) => response.json())
    .then(async (data) => {
      resultMessage.value = data.status;
      resultColor.value = (data.status === 'Invitation sent' || data.status === 'Member added') ? 'green' : 'red';
      if (data.status === 'Invitation sent') {
        inviteEmail.value = '';
        await requestInvitations();
      } else if (data.status === 'Member added') {
        inviteEmail.value = '';
        await requestMembers();
        emit('changed');
      }
    });
  }

  async function cancelInvitation(invitation) {
    if (!window.confirm(`Cancel the invitation sent to ${invitation.email}?`)) {
      return;
    }

    await fetch(apiCancelInvitationUrl, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invitationID: invitation.id
      })
    })
    .then((response) => response.json())
    .then(async (data) => {
      resultMessage.value = data.status;
      resultColor.value = data.status === 'Invitation cancelled' ? 'green' : 'red';
      if (data.status === 'Invitation cancelled') {
        await requestInvitations();
      }
    });
  }

  onMounted(async () => {
    await requestMembers();
    await requestInvitations();
  });
  onBeforeUnmount(() => clearTimeout(searchTimer));
</script>

<template>
  <Transition>
    <form v-if="loaded" @submit.prevent>
      <fieldset>
        <legend>Group Members</legend>
        <div v-if="resultMessage" class="alert" :class="`alert-${resultColor}`">{{ resultMessage }}</div>

        <div class="member-search">
          <input
            type="text"
            v-model="search"
            autocomplete="off"
            placeholder="Search a user to add"
            aria-label="Search a user to add"
            @input="onSearchInput"
            @focus="openDropdown"
            @blur="closeDropdown"
            @keydown.esc="closeDropdown"
          >
          <ul v-if="dropdownOpen" class="candidates">
            <li v-if="candidates.length === 0" class="no-result">No user found</li>
            <!-- mousedown fires before the input blur, which would otherwise close the list before the click -->
            <li v-for="candidate in candidates" :key="candidate.id" @mousedown.prevent="selectCandidate(candidate)">
              {{ candidate.login }}
            </li>
          </ul>
        </div>
        <button type="button" @click="addMember" class="action">Add Member</button>

        <h3>Invite by email</h3>
        <input type="email" v-model="inviteEmail" autocomplete="off" placeholder="Email of the person to invite" aria-label="Email of the person to invite">
        <button type="button" @click="inviteMember" class="action">Send Invitation</button>

        <div v-if="members.length > 0" class="table-wrapper">
          <h3>Current Members</h3>
          <table class="styled-table full-width">
            <thead>
              <tr>
                <th>Member</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in members" :key="member.id">
                <td>{{ member.login }}</td>
                <td>
                  <button type="button" class="delete" @click="removeMember(member)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>This group has no members yet.</p>
        </div>

        <div v-if="invitations.length > 0" class="table-wrapper">
          <h3>Pending Invitations</h3>
          <table class="styled-table full-width">
            <thead>
              <tr>
                <th>Email</th>
                <th>Expires</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invitation in invitations" :key="invitation.id">
                <td>{{ invitation.email }}</td>
                <td>{{ invitation.expires }}</td>
                <td>
                  <button type="button" class="delete" @click="cancelInvitation(invitation)">Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </fieldset>
    </form>
  </Transition>
</template>

<style scoped>
  .member-search {
    position: relative;
    width: var(--input-width);
  }

  .member-search input {
    width: 100%;
    box-sizing: border-box;
  }

  .candidates {
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    margin: 0.3em 0 0;
    padding: 0.3em 0;
    max-height: 12em;
    overflow-y: auto;
    list-style: none;
    background-color: var(--color-surface-solid);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-card);
  }

  .candidates li {
    padding: 0.4em 1em;
    cursor: pointer;
  }

  .candidates li:hover:not(.no-result) {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .candidates li.no-result {
    cursor: default;
    opacity: 0.7;
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
