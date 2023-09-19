<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Container from '@/components/Container.vue'
import { useUsersStore } from '@/stores/users.js'

const userStore = useUsersStore() 

onMounted(() => {
  userStore.getUser()
})
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
