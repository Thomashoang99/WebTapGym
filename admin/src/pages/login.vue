<template>
  <div class="wrapper">
    <div class="container">
        <h2>ADMIN LOGIN</h2>
        <form>

        <div class="input-group">
            <label>Email:</label>
            <input v-model="email" placeholder="Email..." type="email" required />
        </div>

        <div class="input-group">
            <label>Password:</label>
            <input v-model="password" placeholder="Password..." type="password" required />
        </div>
        
        <button type="button" @click="handleLogin">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
        </form>
    </div>
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
      await auth.login({ 
        email: email.value, 
        password: password.value });
      console.log('Successful login');
      router.push('/admin');
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }
</script>
  
<style scoped>

  * {
    color: var(--text-primary);
  }
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
    display: flex;
    flex-direction: column;
    width: 400px;
    margin: 0 auto;
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
    color: black;
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
</style>