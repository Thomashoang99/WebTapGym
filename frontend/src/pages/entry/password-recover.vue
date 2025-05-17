<template>
  <div class="wrapper">
    <div class="container">
      <h2>LẤY LẠI MẬT KHẨU</h2>
      <form @submit.prevent="handlePasswordChange">
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

        <button type="submit">Đổi mật khẩu</button>
        <span style="text-align: center; color: red" v-if="error">{{ error  }}</span>
        <span style="text-align: center; color: cyan" v-if="success">{{ success  }}</span>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api';
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
        router.push('/login');
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
.wrapper {
  min-height: 100vh;
  background: 
      linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),
      url('../../assets/banner.jpg') no-repeat center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.container {
  width: 400px;
  margin: 0 auto;
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
  color: var(--text-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 1rem 0 0.5rem 0;
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
