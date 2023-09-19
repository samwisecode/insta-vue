<script setup>

const props = defineProps(['posts'])

</script>

<template>
    <div class="image-gallery-container">
            <img
            v-for="post in props.posts"
            :key="post.id"
            :src="`https://dyiluggnrzvitabfqdqa.supabase.co/storage/v1/object/public/images/${post.url}`"
            />
    </div>
</template>

<style scoped>
.image-gallery-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
img {
    width: 200px;
    margin: 10px;
}
</style>