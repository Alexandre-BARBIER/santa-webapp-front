<template>
  <section class="hero">
    <IconNPELogo class="hero-logo" aria-hidden="true" />
    <h1 class="hero-title">Santa Zapy</h1>
    <p class="hero-tagline">Organise your Secret Santa: create a group, share your gift list and let the draw do the rest.</p>
    <div v-if="isLoggedIn !== null" class="hero-actions">
      <template v-if="isLoggedIn">
        <RouterLink class="btn-primary" to="/groups">My groups</RouterLink>
        <RouterLink class="btn-secondary" to="/mygifts">My gifts</RouterLink>
      </template>
      <template v-else>
        <RouterLink class="btn-primary" to="/signup">Create an account</RouterLink>
        <RouterLink class="btn-secondary" to="/login">Log in</RouterLink>
      </template>
    </div>
  </section>
  <div class="container" aria-hidden="true">
    <div class="santa santa_left"></div>
    <div class="presents">
      <IconNPELogo class="present present-1" />
      <IconNPELogo class="present present-2" />
      <IconNPELogo class="present present-3" />
    </div>
    <div class="santa santa_right"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import config from '@config/config.json'
import IconNPELogo from '@components/icons/IconNPELogo.vue'

const isLoggedIn = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(`${config.api.protocol}://${config.api.ip}/api/myprofile`, {
      credentials: 'include',
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    isLoggedIn.value = response.ok
  } catch {
    isLoggedIn.value = false
  }
})
</script>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: clamp(1.5rem, 5vw, 3.5rem) 1rem 1rem;
}

.hero-logo {
  width: 96px;
  height: 102px;
  filter: drop-shadow(0 6px 16px rgba(20, 13, 13, 0.25));
}

.hero-title {
  font-size: clamp(2.4rem, 7vw, 4rem);
}

.hero-tagline {
  max-width: 36rem;
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.santa {
  position: relative;
  width: 250px;
  height: 250px;
  background-size: cover;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-direction: alternate;
}

.santa_left {
  background-image: url('../assets/santa_left.png');
  animation-name: santaDance_left;
  margin-right: -50px; /* This would make it overlap with the presents */
}

.santa_right {
  background-image: url('../assets/santa_right.png');
  animation-name: santaDance_right;
  margin-left: -50px; /* This would make it overlap with the presents */
}

@keyframes santaDance_left   {
    0% { transform: translateX(0); }
    100% { transform: translateX(-30px) rotate(-10deg); }
  }

@keyframes santaDance_right   {
    0% { transform: translateX(0); }
    100% { transform: translateX(30px) rotate(10deg); }
  }

.presents {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0em;
}

.present {
  transform: scale(0.75);
  margin-left: -20px; /* This would make it overlap with the presents */
  margin-right: -20px; /* This would make it overlap with the presents */
}

/* Hide 2 presents when not enough space
   Calculation: 2 santas (225px each + 30px animation) + 3 presents (90px each) + gaps = ~800px needed */
@media (max-width: 1079px) {
  .present-2,
  .present-3 {
    display: none;
  }
}

/* Hide santa_left when not enough space
   Calculation: 2 santa (300px + 40px animation) + 1 present (~120px) + gaps = ~800px needed */
@media (max-width: 639px) {
  .santa_right {
    display: none;
  }

  .presents {
    display: none;
  }
}

@media (max-width: 320px) {
  .santa {
    width: 200px;
    height: 200px;
  }

  @keyframes santaDance_left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-20px) rotate(-10deg); }
  }
}

@media (max-width: 260px) {
  .santa {
    width: 150px;
    height: 150px;
  }

  @keyframes santaDance_left {
    0% { transform: translateX(0); }
    100% { transform: translateX(10px) rotate(8deg); }
  }
}
</style>

