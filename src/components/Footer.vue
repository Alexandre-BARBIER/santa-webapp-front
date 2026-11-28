<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <nav class="footer">
    <span>© {{ year }} Santa Zapy</span>
    <span aria-hidden="true">·</span>
    <RouterLink to="/about">Privacy &amp; GDPR</RouterLink>
  </nav>
</template>

<style scoped>
nav.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  min-height: var(--footer-height);
  padding: 0.75rem 1rem;
  background-color: var(--color-footer);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

nav.footer a {
  color: rgba(255, 255, 255, 0.85);
  padding: 0.2em 0.5em;
}

nav.footer a:hover {
  color: var(--white);
  background-color: rgba(255, 255, 255, 0.08);
}
</style>
