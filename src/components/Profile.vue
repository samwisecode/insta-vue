<script setup>
import Container from '@/components/Container.vue'
import UserBar from '@/components/UserBar.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase.js'
import { useUsersStore } from '../stores/users'
import { storeToRefs } from 'pinia'

const userStore = useUsersStore()
const posts = ref([])
const route = useRoute()
const user = ref(null)
const isFollowing = ref(null)
const { username } = route.params
const loading = ref(false)
const { user: loggedInUser } = storeToRefs(userStore)

const addNewPost = post => {
  if(post) {
    posts.value.unshift(post)
  }
}

const fetchIsFollowing = async () => {
  if (loggedInUser && (loggedInUser.id != user.value.id)) {
  console.log('userValueUsername', user.value.username)

    const { data } = await supabase
      .from('followers_following')
      .select()
      .eq('follower_id', loggedInUser.value.id)
      .eq('following_id', user.value.id)
      .single()

    if (data) isFollowing.value = true
  }
}

const fetchData = async () => {
  loading.value = true
  const { data: userData } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .single()

    if (!userData) {
      loading.value = false
      return user.value = null
    }

    user.value = userData

    console.log('userData', userData)

    const { data: postsData } = await supabase
      .from('posts')
      .select()
      .eq('owner_id', user.value.id)
      .order('created_at', { ascending: false })

      posts.value = postsData

      console.log('postsData', postsData)

      await fetchIsFollowing()

      loading.value = false

}

onMounted(() => {
  fetchData()
})

watch(loggedInUser, () => {
  fetchIsFollowing()
})

</script>

<template>
  <main>
    <Container>
        <div class="profile-container" v-if="!loading">
          <UserBar
              :user="user"
              :key="$route.params.username"
              :addNewPost="addNewPost"
              :isFollowing="isFollowing"
          />
          <div class="gallery">
            <ImageGallery :posts="posts" />
          </div>
      </div>
      <div class="spinner" v-else>
        <a-spin size="large" />
      </div>
    </Container>
  </main>
</template>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>