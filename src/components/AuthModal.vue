<script setup>
import { reactive, ref } from "vue";
import { useUsersStore } from "@/stores/users.js";
import { storeToRefs } from "pinia";
import EmailInput from "./shared/EmailInput.vue";

const userStore = useUsersStore();

// This is now a ref, which will cause it to rerender when it changes
const { errorMessage, loading, user } = storeToRefs(userStore);

const open = ref(false);
const props = defineProps(["isLogin"]);

const userCredentials = reactive({
  username: "",
  email: "",
  password: "",
});

const showModal = () => {
  open.value = true;
};

const clearUserCredentialsInput = () => {
  userCredentials.username = "";
  userCredentials.email = "";
  userCredentials.password = "";
  userStore.clearErrorMessage();
};

const handleOk = async () => {
  if (props.isLogin) {
    await userStore.handleLogin({
      password: userCredentials.password,
      email: userCredentials.email,
    });
  } else {
    await userStore.handleSignup({
      username: userCredentials.username,
      password: userCredentials.password,
      email: userCredentials.email,
    });
  }
};

const handleCancel = () => {
  clearUserCredentialsInput();
  open.value = false;
};

const title = props.isLogin ? "Login" : "Sign Up";
</script>

<template>
  <div>
    <a-button type="primary" @click="showModal" class="nav-button">{{
      title
    }}</a-button>
    <a-modal v-model:open="open" :title="title" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
          >{{ title }}</a-button
        >
      </template>
      <div :class="{ invisible: loading }">
        <a-input
          v-if="!isLogin"
          v-model:value="userCredentials.username"
          placeholder="username"
          class="input-text"
        />
        <EmailInput />
        <a-input
          v-model:value="userCredentials.password"
          placeholder="password"
          type="password"
          class="input-text"
        />
      </div>
      <a-typography-text type="danger" v-if="errorMessage">{{
        errorMessage
      }}</a-typography-text>
    </a-modal>
  </div>
</template>

<style scoped>
.nav-button {
  margin-left: 10px;
}
.input-text {
  margin-top: 15px;
}
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}
.invisible {
  visibility: hidden;
}
</style>
