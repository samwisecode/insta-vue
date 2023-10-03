<script setup>
import { reactive, ref } from "vue";
import { useUsersStore } from "@/stores/users.js";
import { storeToRefs } from "pinia";
import EmailInput from "./shared/EmailInput.vue";

const userStore = useUsersStore();
const { errorMessage, loading } = storeToRefs(userStore);
const open = ref(false);

const userCredentials = reactive({
  email: "",
  password: "",
});

const showModal = () => {
  open.value = true;
};

const submitForm = async () => {
  await userStore.handleLogin({
    password: userCredentials.password,
    email: userCredentials.email,
  });
};

const closeModal = () => {
  clearUserCredentialsInputs();
  open.value = false;
};

const clearUserCredentialsInputs = () => {
  userCredentials.email = "";
  userCredentials.password = "";
};
</script>

<template>
  <div>
    <a-button type="primary" @click="showModal" class="nav-button">{{
      title
    }}</a-button>
    <a-modal v-model:open="open" :title="title">
      <div :class="{ invisible: loading }">
        <EmailInput v-model="userCredentials.email" />
        <a-input
          v-model:value="userCredentials.password"
          placeholder="password"
          type="password"
          class="input-text"
        />
      </div>
      <a-typography-text v-if="errorMessage" type="danger">
        {{ errorMessage }}
      </a-typography-text>
      <template #footer>
        <a-button key="back" @click="closeModal">Cancel</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="submitForm"
        >
          Login
        </a-button>
      </template>
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
