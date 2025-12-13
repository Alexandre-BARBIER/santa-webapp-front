<template>
  <div class="welcome-section">
    <IconNPELogo class="logo-left" />
    <HelloWorld msg="Welcome on Santa Zapy" />
    <IconNPELogo class="logo-right" />
  </div>
  <div class="container">
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
  import IconNPELogo from '@components/icons/IconNPELogo.vue'
  import HelloWorld from '@components/HelloWorld.vue'
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
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

.container {
  gap: -20em;
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

.welcome-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: -2em;
  padding: 0 1em;
  margin-top: 1em;
  gap: 1em;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.logo-left,
.logo-right {
  scale: 0.5;
  flex-shrink: 0;
}

.logo-left {
  justify-self: end;
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

  .welcome-section {
    justify-content: center;
    padding: 0 0.5em;
  }

  .logo-left,
  .logo-right {
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

