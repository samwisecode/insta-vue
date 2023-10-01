<script setup>
import { ref } from 'vue'
import { isPasswordValid, getPasswordError } from '../../validation/inputs/password'

const input = ref('')
const isValid = ref(false)
const error = ref('')
const validate = () => {
  isValid.value = isPasswordValid(input.value)
  error.value = getPasswordError(input.value)
}
</script>

<template>
  <a-input
    v-model:value="input"
    @input="validate()"
    placeholder="password"
    type="password"
    class="input-text"
  />
  <span v-if="error" style="color: red;">
    {{ error }}
  </span>
</template>
