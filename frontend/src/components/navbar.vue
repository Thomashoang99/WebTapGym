<template>
<nav class="navbar">
    <div class="logo">
        <h1>THE GYM SITE</h1>
    </div>
    <div class="nav-links">
        <router-link class="nav-link button-primary" to="/home">Home</router-link>
        <router-link class="nav-link button-primary" to="/articles">Articles</router-link>
        <router-link class="nav-link button-primary" to="/exercises">Exercises</router-link>
        <router-link class="nav-link button-primary" to="/programs">Programs</router-link>
        <router-link v-if="authStore.isLoggedIn" class="nav-link button-primary" to="/progress-tracking">Progress Tracker</router-link>
        <router-link v-if="!authStore.isLoggedIn" class="nav-link button-primary" to="/login">Login</router-link>
        <button v-else class="nav-link button-primary" @click="onLogout">Logout</button>
    </div>
    <div class="login">
        {{ username }}
    </div>
</nav>
</template>
    
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const username = computed(() => {
  return authStore.isLoggedIn ? authStore.user.username : 'Guest';
});

const onLogout = () => {
    alert('Logging out...');
    authStore.logout();
    router.push('/home');
}
</script>

<style scoped>

nav {
    width: 100%; height: 100%;
    display: flex;
    background-color: var(--accent-primary);
}

nav>*{
    display: flex;
    align-items: center;
}

.logo {
    flex: 1;
    display: flex;
    align-items: center;
}

.logo h1{
    font-size: calc(1rem + ((1vw - 0.48rem) * 1.3889));
}

.nav-links{
    flex: 5;
    display: flex;
    height: auto;
    justify-content: center;
}

.login {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-link{
    position: relative;
    padding: 0.5rem calc(0.75rem + ((1vw - 0.48rem) * 1.7361));
    text-decoration: none;
    font-size: calc(1rem + ((1vw - 0.48rem) * 0.3472));
}

.nav-link::after{
    content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  height: 2px;
  background-color: var(--text-primary);
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease;
  width: calc(100% - 8px);
}

.nav-link:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link.router-link-active::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link.router-link-active {
  font-weight: bold;
  color: var(--text-primary);
}

@media (max-width: 768px) {
    .logo h1 {
        font-size: 1rem;
    }
    .nav-links{
        gap: 0;
    }
    .nav-link{
        font-size: 1rem;
        padding: 0.5rem 0.75rem;
    }
}
</style>