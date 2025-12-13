<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const footerRoutes = ref(router.getRoutes().filter((route) => route.name === 'About'))

</script>

<template>
  <nav class="footer">
    <RouterLink class="banner" v-for="(route) in footerRoutes" :to="route.path">{{ route.name }}</RouterLink>
  </nav>
</template>

<style scoped>

nav.footer {
  display: flex;
  margin: 0;
  
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  
  height: var(--footer-height);
  background-color: var(--vt-c-black);
}

a.banner {
  display: flex;
  align-items: center;
  height: calc(var(--footer-height)*0.7);
  border-radius: 0;
  padding-inline: 1em;
}

nav > a {
  color: white;
  font-size: 1rem;
  padding-inline: 0.8em;
  border-radius: 0.4em;
}

nav > a:first-child {
  margin-left: 0.6em;
}

@media (max-width: 640px) {
  nav.footer {
    gap: 0.5rem;
  }

  nav > a {
    font-size: 0.9rem;
    padding-inline: 0.6em;
  }

  nav > a:first-child {
    margin-left: 0.4em;
  }

  a.banner {
    padding-inline: 0.7em;
  }
}

@media (max-width: 480px) {
  nav.footer {
    gap: 0.3rem;
  }

  nav > a {
    font-size: 0.8rem;
    padding-inline: 0.4em;
  }

  nav > a:first-child {
    margin-left: 0.2em;
  }

  a.banner {
    padding-inline: 0.5em;
  }
}
</style>