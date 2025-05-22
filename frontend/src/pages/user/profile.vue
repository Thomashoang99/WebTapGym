<template>
  <div class="profile-page">
    <h2>My Profile</h2>
    <form @submit.prevent="save" enctype="multipart/form-data">
      <div class="field">
        <label>Username</label>
        <input type="text" v-model="form.username" required />
      </div>

      <div class="field">
        <label>Email</label>
        <input type="email" v-model="form.email" required />
      </div>

      <div class="field">
        <label>Profile Image</label>
        <input type="file" @change="onFileChange" accept="image/*" />
        <img v-if="preview" :src="preview" class="preview-img" />
      </div>

      <div class="field">
        <label>Member Since</label>
        <input :value="formatDate(form.createdAt)" disabled />
      </div>

      <div class="field">
        <label>Current Password</label>
        <input type="password" v-model="passwords.old" />
      </div>

      <div class="field">
        <label>New Password</label>
        <input type="password" v-model="passwords.new" />
      </div>

      <button class="button-primary" type="submit" :disabled="saving">
        {{ saving ? 'Saving…' : 'Save Changes' }}
      </button>
    </form>

    <div v-if="error" class="status error">{{ error }}</div>
    <div v-if="success" class="status success">{{ success }}</div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import api from '../../api';
import { formatDate } from '../../utils/helper';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const form = reactive({ username: '', email: '', createdAt: '', imageUrl: '' });
const passwords = reactive({ old: '', new: '' });
const file    = ref(null);
const preview = ref('');
const saving  = ref(false);
const error   = ref('');
const success = ref('');

function onFileChange(e) {
  const f = e.target.files[0];
  if (f) {
    file.value = f;
    preview.value = URL.createObjectURL(f);
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/user/profile');
    Object.assign(form, data);
    preview.value = form.imageUrl;
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  }
});

async function save() {
  saving.value = true;
  error.value = '';
  success.value = '';

  const fd = new FormData();
  fd.append('username', form.username);
  fd.append('email', form.email);
  if (file.value) fd.append('image', file.value);

  if (passwords.old && passwords.new) {
    fd.append('oldPassword', passwords.old);
    fd.append('newPassword', passwords.new);
  }

  try {
    const { data } = await api.put('/user/profile', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    success.value = 'Profile updated successfully!';
    form.imageUrl = data.imageUrl;
    preview.value = data.imageUrl;
    passwords.old = '';
    passwords.new = '';
    authStore.rehydrate();
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 2rem auto;
  color: var(--text-primary);
}
h2 {
    margin-bottom: 1rem;
}
.field {
  margin-bottom: 1rem;
}
.field label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
}
.field input[type="text"],
.field input[type="email"],
.field input[type="password"],
.field input[type="file"],
.field input[disabled] {
  width: 100%;
  padding: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid #333;
  border-radius: 4px;
}
.preview-img {
  margin-top: 0.5rem;
  max-width: 120px;
  border-radius: 4px;
}
.status.error {
  color: #f44336;
  margin-top: 1rem;
}
.status.success {
  color: #06D6A0;
  margin-top: 1rem;
}
</style>
