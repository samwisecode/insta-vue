<script setup>
import {ref} from 'vue';
import {isEmailValid, getEmailErrors} from '../../validation/email'

const email = ref("");
const isValid = ref(false);
const error = ref("");

const validate = () => {
  isValid.value = isEmailValid(email.value);
  error.value = getEmailErrors(email.value);
};
</script>

<template>
  <a-input
    v-model:value="email"
    @change="validate()"
    placeholder="email"
    class="input-text"
  />
  <span v-if="error" style="color: red">
    {{ error }}
  </span>
</template>
