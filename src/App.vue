<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'

import IconNPELogo from '@components/icons/IconNPELogo.vue'
import HelloWorld from '@components/HelloWorld.vue'
import Banner from '@components/Banner.vue'
import Footer from '@components/Footer.vue'

// Canvas setup
const canvasRef = ref(null)

function createSnowflake(canvas) {
  const ctx = canvas.getContext("2d")
  const snowflakes = []

  function initSnowflakes() {
    const count = 150
    for (let i = 0; i < count; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
        speed: Math.random() + 0.5,
        opacity: Math.random(),
        dx:(Math.random() - 0.5) * 0.5
      })
    }
  }

  function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#fff"
    snowflakes.forEach((flake) => {
      ctx.globalAlpha = flake.opacity
      ctx.beginPath()
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    })
  }

  function updateSnowflakes() {
    snowflakes.forEach((flake) => {
      flake.y += flake.speed
      flake.x += flake.dx
      if (flake.y > canvas.height) {
        flake.y = -flake.radius
        flake.x = Math.random() * canvas.width
      }
      if (Math.random() < 0.02) { // Adjust randomness frequency as needed
        flake.dx += (Math.random() - 0.5) * 0.1; // Small random change
        flake.dx = Math.max(-1, Math.min(1, flake.dx)); // Limit lateral speed
      }
    })
  }

  function animate() {
    drawSnowflakes()
    updateSnowflakes()
    requestAnimationFrame(animate)
  }

  initSnowflakes()
  animate()
}

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  createSnowflake(canvas)

  const resizeHandler = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener("resize", resizeHandler)
  onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler)
  })
})
</script>

<template>
  <header>
    <Banner />
  </header>

  <main>
    <!-- Canvas for snowflakes -->
    <canvas ref="canvasRef" class="snowflakes-canvas"></canvas>

    <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: -2em;">
      <IconNPELogo style="scale: 0.5; justify-self: end;" />
      <HelloWorld msg="Welcome on the NorthPoleExchange" />
      <IconNPELogo style="scale: 0.5;" />
    </div>
    <RouterView />
  </main>

  <footer>
    <Footer />
  </footer>
</template>

<style scoped>
/* Add styles for the canvas */
.snowflakes-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}

footer {
  margin: 0;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
