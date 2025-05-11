<template>
    <div class="container">
        <h2>ĐĂNG NHẬP</h2>
        <form @submit.prevent="handleLogin">

        <div class="input-group">
            <label>Email:</label>
            <input v-model="email" placeholder="Nhập địa chỉ email..." type="email" required />
        </div>

        <div class="input-group">
            <label>Mật khẩu:</label>
            <input v-model="password" placeholder="Nhập mật khẩu..." type="password" required />
        </div>
        
        <button type="submit" @click="handleLogin">Đăng nhập</button>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="optional">
          <p class="prompt">Chưa có tài khoản? <router-link to="./register">Đăng ký</router-link></p>
          <p class="prompt"><router-link to="./password-recovery">Đổi mật khẩu</router-link></p>
        </div>
        </form>
    </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/authStore';

  const email = ref(''); const password = ref('');
  const error = ref(''); 
  const router = useRouter();
  const auth = useAuthStore();

  const handleLogin = async () => {
    try {
      await auth.login({ email: email.value, password: password.value });
      console.log('Đăng nhập thành công. Đang chuyển hướng về trang chủ...');
      setTimeout(() => {router.push('/home')}, 300);
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 80px auto;
    padding: 1rem;
    border: 1px solid var(--text-secondary);
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
    box-sizing: border-box;
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    background-color: var(--accent-primary);
    color: var(--text-primary);
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

  .optional {
    display: flex;
    justify-content: space-between;
  }

  .prompt a{
    all: unset;
    color: var(--accent-secondary);
    text-decoration: underline;
    cursor: pointer;
  }

  .prompt a:active{
    color: var(--accent-primary);
  }
</style>