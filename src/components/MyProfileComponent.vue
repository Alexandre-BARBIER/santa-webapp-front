<script setup>
// TODO: emits form
  import { ref, onMounted } from 'vue'
  import config from '@config/config.json';
  import { useRouter } from 'vue-router'

  const router = useRouter()
  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const apiGetMyId = `${protocol}://${ip}/api/myprofile`;

  onMounted(async () => {
    getMyProfile()
  })


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
        router.push((`/profile/${data.user_id}`))
      })
    })
    .catch((error) => {
      router.push('/login')
    })
  }
  getMyProfile()


</script>

<template>
</template>

<style scoped>
</style>