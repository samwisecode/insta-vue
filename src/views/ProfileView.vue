<script setup>

import Container from '@/components/Container.vue'
import Profile from '@/components/Profile.vue'

</script>

<template>
    <Container>
        <div class="profile-container">
           <Profile :key="$route.params.username" />
        </div>
    </Container>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}
</style>