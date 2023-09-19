<script setup>
import Container from '@/components/Container.vue'
import Card from '@/components/Card.vue'

const data = [
    {
        id: 1,
        username: 'samwisecodes',
        image_url: 'https://images-assets.nasa.gov/image/PIA25020/PIA25020~orig.jpg',
        caption: 'This is a caption'
    },
    {
        id: 2,
        username: 'NASA',
        image_url: 'https://images-assets.nasa.gov/image/PIA25917/PIA25917~orig.jpg',
        caption: 'test'
    }
]
</script>

<template>
    <Container>
        <div class="timeline-container">
            <Card
            v-for="post in data"
            :key="post.id"
            :post="post"
            />
        </div>
    </Container>
</template>

<style scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}
</style>