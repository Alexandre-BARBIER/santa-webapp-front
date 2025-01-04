<script setup>
  import { ref, onMounted, computed } from 'vue'
  import config from '@config/config.json';
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  // Destructure the API IP and port from the configuration object
  // Define api urls
  const { ip, protocol } = config.api;
  const apiSecretGiftsUrl = `${protocol}://${ip}/api/secret/mysecret/group/${route.params.id}`;
  const apiGiftSelectUrl = `${protocol}://${ip}/api/gift/select`;
  const apiGiftUnselectUrl = `${protocol}://${ip}/api/gift/unselect`;
  const apiGetMyId = `${protocol}://${ip}/api/myprofile`;
  
  const myid = ref()
  const secretgifts = ref([])
  const receiver = ref('')
  const date = ref('')

  const loaded = ref(false)
  
  async function getMyProfile() {
    await fetch(apiGetMyId, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        dataType: 'json'
    })
    .then((response) => {
      response.json().then((data) => {
        myid.value = data.user_id.toString()
      })
    })
    .catch((error) => {
      router.push('/login')
    })
  }

  async function RequestSecretGifts() {
    await fetch(apiSecretGiftsUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        secretgifts.value = data.gifts;
        receiver.value = data.receiverLogin;
        date.value = data.date;
        loaded.value = true;
      });
    })
    .catch((error) => {
      router.push('/login')
    })
  }

  onMounted(async () => {
    await getMyProfile()
    await RequestSecretGifts()
  })

async function RequestSelectGift(gift_id_to_select) {
    await fetch(apiGiftSelectUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        gift_id: gift_id_to_select
      })
    })
    await RequestSecretGifts()
}

async function RequestUnselectGift(gift_id_to_unselect) {
    await fetch(apiGiftUnselectUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        gift_id: gift_id_to_unselect
      })
    })
    await RequestSecretGifts()
}

</script>

<template>
<Transition>
  <form v-if="loaded" >
    <fieldset >
      <legend>Secret Santa</legend>
        <div class="grid-wrapper">
        <span>The person receiving your gift is : </span>
        <span>{{receiver}}</span>
        <span>Secret Santa date :</span>
        <span>{{date}}</span>
        </div>
        <span>{{receiver}}'s ggift list : </span>
        <div v-if="secretgifts.length > 0">
          <table class="styled-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Select/Unselect</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="gift in secretgifts" :key="gift.giftID">
                    <td>{{gift.name}}</td>
                    <td>{{gift.description}}</td>
                    <td>{{gift.price}}</td>
                    <td>
                    <button v-if="gift.gifterID=='0'" class="select" @click="RequestSelectGift(gift.giftID)">Select</button>
                    <button v-else-if="gift.gifterID==myid" class="delete" @click="RequestUnselectGift(gift.giftID)">Unselect</button>
                    <button v-else disabled class="disabled">Already Selected</button>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>No gift has been added to {{receiver}}'s gift list.</p>
        </div>
      <div>
      </div>

    </fieldset>
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

</style>