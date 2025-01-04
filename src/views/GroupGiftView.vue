<script setup>
import GroupGiftComponent from '../components/GroupGiftComponent.vue'
import SecretGiftComponent from '../components/SecretGiftComponent.vue'

import { ref, onMounted } from 'vue'
import config from '@config/config.json';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router = useRouter();

const { ip, protocol } = config.api;
const apiSecretSatusUrl = `${protocol}://${ip}/api/secret/info/group/${route.params.id}`;

const secret_santa = ref(false);

async function RequestSecretSatus() {
    await fetch(apiSecretSatusUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        if (data.secret_santa === 'true') {
          secret_santa.value = true
        }
      });
    })
    .catch((error) => {
      router.push('/login')
    })
  }

onMounted(async () => {
  RequestSecretSatus()
})


</script>

<template>
  <SecretGiftComponent v-if="secret_santa"/>
  <GroupGiftComponent v-else/>
</template>

