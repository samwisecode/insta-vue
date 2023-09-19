<script setup>
import UploadPhotoModal from '@/components/UploadPhotoModal.vue'
import { useUsersStore } from '@/stores/users.js'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { supabase } from '../supabase'

const props = defineProps(['user', 'addNewPost', 'isFollowing'])
const userStore = useUsersStore()
const { user } = storeToRefs(userStore)
const route = useRoute()
const { username: profileUsername } = route.params

console.log(profileUsername)

const followUser = async () => {
    await supabase
        .from('followers_following')
        .insert({
            follower_id: user.value.id,
            following_id: props.user.id
        })
}

const unFollowUser = async () => {
    await supabase
        .from('followers_following')
        .delete()
        .eq('follower_id', user.value.id)
        .eq('following_id', props.user.id)
}

</script>

<template>
    <div class="userbar-container" v-if="props.user">
        <div class="top-content">
            <a-typography-title :level="2">{{ props.user.username }}</a-typography-title>
            <div v-if="profileUsername == props.user.username">
                <UploadPhotoModal
                :addNewPost="addNewPost"
                />
            </div>
            <div v-if="!loggedInUser && (loggedInUser != profileUsername)">
                <a-button @click="followUser" v-if="!props.isFollowing">Follow</a-button>
                <a-button v-else @click="unFollowUser">Following</a-button>
            </div>
        </div>
        <div class="bottom-content">
            <!-- <a-typography-title :level="5">{{ props.userInfo.posts }} posts</a-typography-title>
            <a-typography-title :level="5">{{ props.userInfo.followers }} followers</a-typography-title>
            <a-typography-title :level="5">{{ props.userInfo.following }} following</a-typography-title> -->
        </div>
    </div>
    <div class="userbar-container" v-else>
        <div class="top-content">
            <a-typography-title :level="3">User Not Found</a-typography-title>
        </div>
    </div>
</template>

<style scoped>
.userbar-container {
    padding-bottom: 75px;
}
.top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bottom-content {
    display: flex;
    align-items: center;
}
.bottom-content h5 {
    margin: 0 30px 0 0;
    padding: 0;
}
</style>