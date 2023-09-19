<script setup>

const card = defineProps(['post'])

</script>

<template>
    <a-card hoverable class="card" :card="post">
        <template #cover>
            <img alt="{{ post.caption }}" :src="post.image_url" />
        </template>
        <a-card-meta :title="post.username">
            <template #description>{{ post.caption }}</template>
        </a-card-meta>
    </a-card>
</template>

<style scoped>
.card {
    width: 300px;
    margin-bottom: 20px;
}
</style>