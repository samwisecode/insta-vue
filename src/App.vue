<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Container from '@/components/Container.vue'

</script>

<template>
  <main>
    <Container>
      <Navbar />
      <RouterView />
    </Container>
  </main>
</template>

<style scoped>

</style>
