<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref } from "vue";
import AuthModal from "@/components/AuthModal.vue";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/users.js";

const userStore = useUsersStore();
const { user, loadingUser } = storeToRefs(userStore);
const router = useRouter();
const searchUsername = ref("");

const onSearch = (searchTerm) => {
  if (searchTerm) {
    router.push(`/profile/${searchTerm}`);
  }
};

const goToUsersProfile = () => {
  router.push(`/profile/${user.value.username}`);
};

const signOut = () => {
  userStore.handleLogout();
};
</script>

<template>
  <div class="nav-container">
    <a-layout class="layout">
      <a-layout-header>
        <div class="left-content">
          <RouterLink to="/">Instavue</RouterLink>
          <a-input-search
            :value="searchUsername.value"
            v-model:value="value"
            placeholder="@username"
            style="width: 400px"
            @search="onSearch"
          />
        </div>
        <div v-if="!loadingUser" class="content">
          <div class="right-content" v-if="!user">
            <AuthModal :isLogin="false" />
            <AuthModal :isLogin="true" />
          </div>
          <div class="right-content" v-else>
            <a-button type="primary" @click="goToUsersProfile"
              >Profile</a-button
            >
            <a-button type="primary" @click="signOut">Logout</a-button>
          </div>
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
.content {
  display: flex;
  align-items: center;
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
  margin-right: 20px;
}
.right-content button {
  margin-left: 10px;
}
</style>
