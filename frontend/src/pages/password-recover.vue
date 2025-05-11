<template>
  <div class="container">
    <h2>LẤY LẠI MẬT KHẨU</h2>
    <form @submit.prevent="handleRegister">
      <div class="input-group">
        <label>Địa chỉ email:</label>
        <input v-model="email" placeholder="Nhập tên người dùng..." type="text" required />
      </div>


      <div class="input-group">
        <label>Mật khẩu:</label>
        <input v-model="password" placeholder="Nhập mật khẩu..." type="password" required />
      </div>

      <div class="input-group">
        <label>Nhập lại mật khẩu:</label>
        <input v-model="passwordReenter" placeholder="Nhập lại mật khẩu..." type="password" required />
      </div>

      <button type="submit" @click="handlePasswordChange">Đổi mật khẩu</button>
      <span style="text-align: center; color: red" v-if="error">{{ error  }}</span>
      <span style="text-align: center; color: cyan" v-if="success">{{ success  }}</span>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api';
const email = ref('')
const password = ref(''); const passwordReenter = ref('')
const error = ref(''); const success = ref('');
const router = useRouter()

const handlePasswordChange = async () => {
  try {

    if (password.value === passwordReenter.value)
    {
        await api.patch('/user/auth/reset-password', {
            email: email.value,
            newPassword: password.value,
        })
        error.value = '';
        success.value = 'Đổi mật khẩu thành công';
        setTimeout(() => router.push('/login'), 300);
    }
    else {
        success.value = '';
        error.value = "Mật khẩu không trùng khớp";
        return;
    }
  } catch (err) {
    success.value = '';
    error.value = err.response?.data?.message || "Đổi mật khẩu thất bại!";
    console.log(error.value)
  }
} 
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 80px auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: var(--background-primary);
  font-family: sans-serif;
}

h2 {
  text-align: center;
  margin: 1rem 0;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

input {
  width: 100%;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #2c5282;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}

.loginPrompt{
  text-align: center;
}

.loginPrompt a{
  all: unset;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}

.loginPrompt a:active{
  color: red;
}
</style>
