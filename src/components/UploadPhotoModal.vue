<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase.js'
import { useUsersStore } from '@/stores/users.js'
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router'

const usersStore = useUsersStore()
const { user } = storeToRefs(usersStore)
const props = defineProps(['addNewPost'])
const open = ref(false);
const caption = ref('');
const file = ref(null);
const loading = ref(false);
const errorMessage = ref('');
const location = useRoute();
const userInView = location.params.username;
const loggedInUser = user.value?.username //null
let filePath;


const showModal = () => {
  open.value = true;
};

const handleOk = async () => {
  loading.value = true;
  if (file.value) {
    const fileName = Math.floor(Math.random() * 100000)
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${fileName}`, file.value)

    if (error) {
      loading.value = false;
      return errorMessage.value = 'Error uploading image'
    }
    
    filePath = data.path
    await supabase
      .from('posts')
      .insert({
        url: filePath,
        caption: caption.value,
        owner_id: user.value.id
      })
  }
  loading.value = false;
  open.value = false;
  caption.value = '';
  props.addNewPost({
    url: filePath,
    caption: caption.value
  })
};

const handleUploadChange = e => {
  if (e.target.files[0]) {
    file.value = e.target.files[0]
  }
}
</script>

<template>
    <div>
        <a-button @click="showModal" v-if="userInView === loggedInUser">Upload Photo</a-button>
        <a-modal v-model:open="open" title="Upload Photo" @ok="handleOk">
          <div v-if="!loading">
            <input 
              type="file" 
              accept=".jeg,.jpg,.png"
              @change="handleUploadChange"
            />
            <a-input 
              placeholder="Caption" 
              v-model:value="caption"
              :maxlength="50"
            />
            <a-typography-text type="danger" v-if="errorMessage">{{ errorMessage }}</a-typography-text>
          </div>
          <div class="spinner" v-else>
            <a-spin />
          </div>
        </a-modal>
    </div>
</template>

<style scoped>
input {
  margin-bottom: 10px;
}
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
