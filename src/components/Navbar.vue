<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

import AuthModal from '@/components/AuthModal.vue'

const searchUsername = ref('')

const onSearch = () => {
    console.log('searching for', searchUsername.value)
}
  
</script>

<template>
    <div class="nav-container">
        <a-layout class="layout">
            <a-layout-header>
                <div class="left-content">
                    <RouterLink to="/">Instavue</RouterLink>
                    <a-input-search
                        :value="searchUsername"
                        placeholder="@username..."
                        style="width: 300px;"
                        @search="onSearch"
                    />
                </div>
                <div class="right-content">
                    <!-- <a-button type="primary">Sign up</a-button> -->
                    <AuthModal />
                    <a-button type="primary">Log in</a-button>
                </div>
                
            </a-layout-header>
        </a-layout>
    </div>
</template>

<style scoped>
.nav-container header {
    display: flex;
    justify-content: space-between;
}
.left-content {
    display: flex;
    align-items: center;
}
.right-content {
    display: flex;
    align-items: center;
}
.left-content a {
    margin-right: 10px;
}
.right-content button {
    margin-left: 10px;
}
</style>