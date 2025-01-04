<script setup>
// TODO: emits form
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const ip = import.meta.env.VITE_API_HOST
  const protocol = import.meta.env.VITE_API_PROTOCOL
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