<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const ip = import.meta.env.VITE_API_HOST
  const protocol = import.meta.env.VITE_API_PROTOCOL

  const apiMyGiftsUrl = `${protocol}://${ip}/api/mygifts`;
  const apiGiftDeleteUrl = `${protocol}://${ip}/api/gift/delete`;
  const apiGiftAddUrl = `${protocol}://${ip}/api/gift/add`;

  const giftNameInput = ref('')
  const giftDescriptionInput = ref('')
  const giftPriceInput = ref(0)

  const mygifts = ref([])

  const loaded = ref(false)

  async function RequestMyGifts() {
    await fetch(apiMyGiftsUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        mygifts.value = data;
        loaded.value = true;
      });
    })
    .catch((error) => {
      router.push('/login')
    })
  }

  onMounted(async () => {
    await RequestMyGifts()
  })

async function RequestDeleteGift(giftIdToDelete) {
    await fetch(apiGiftDeleteUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        gift_id: giftIdToDelete
      })
    })
    await RequestMyGifts()
}

async function requestAddGift () {
    
    await fetch(apiGiftAddUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        name: giftNameInput.value,
        description: giftDescriptionInput.value,
        price: giftPriceInput.value
      })
    })
    await RequestMyGifts()
  }


</script>

<!-- TODO: Maybe v-show instead of v-if afterwards
Needs some testing
Docs: https://vuejs.org/guide/essentials/conditional.html#v-show -->
<template>
<Transition>
  <form v-if="loaded" @submit.prevent="update_and_back_to_read">
    <fieldset >
      <legend>My Gifts</legend>
      <div v-if="mygifts.length > 0">
        <table class="styled-table">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Delete</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="gift in mygifts" :key="gift.giftID">
                      <td>{{gift.name}}</td>
                      <td>{{gift.description}}</td>
                      <td>{{gift.price}}</td>
                      <td><button class="delete" @click="RequestDeleteGift(gift.giftID)">X</button></td>
                  </tr>
              </tbody>
          </table>
        </div>
        <div v-else>
          <p>You haven't added any gifts to your Gift List.</p>
        </div>
      <div>
      </div>

    </fieldset>
  </form>
  </Transition>
  <Transition>
  <form v-if="loaded" @submit.prevent="requestAddGift">
    <fieldset>
      <legend>New Gift</legend>
      <div class="form-wrapper grid-wrapper">
        
        <label for="giftNameInput">Name*</label>
        <input required placeholder="Enter gift name" id="giftNameInput" name="giftName" type="text" v-model="giftNameInput">
        
        <label for="giftDescriptionInput">Description*</label>
        <input required placeholder="Description" type="text" name="description" id="giftDescriptionInput" v-model="giftDescriptionInput">
        
        <label for="giftPriceInput">Price*</label>
        <input required placeholder="Price" type="number" name="price" id="giftPriceInput" v-model="giftPriceInput">

      </div>
      
      <button type="submit">Add</button>

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