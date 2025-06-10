<template>
  <div class="wrapper">
<div class="container">
    <h2>REGISTER</h2>
    <form>
      <div class="input-group">
        <label>Username</label>
        <input v-model="username" placeholder="Username..." type="text" required />
      </div>

      <div class="input-group">
        <label>Email:</label>
        <input v-model="email" placeholder="Email..." type="email" required />
      </div>

      <div class="input-group">
        <label>Password:</label>
        <input v-model="password" placeholder="Password..." type="password" required />
      </div>

      <button type="button" @click="handleRegister">Register</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="loginPrompt">Got an account? <router-link to="./login">Login</router-link></p>
    </form>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api';
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('');
const router = useRouter()

const handleRegister = async () => {
  try {
    await api.post('/user/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    })
    success.value = 'Successful registration'
    console.log(success.value);
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message;
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
