import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(sessionStorage.getItem('gym-user-token'));
  const user = ref(null);

  const isLoggedIn = computed(() => !!token.value || false);

  const login = async (credentials) => {
    try {
      const res = await api.post('/user/auth/login', credentials);
      token.value = res.data.token;
      user.value = res.data.user;
      sessionStorage.setItem('gym-user-token', token.value);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }

  };

  const logout = () => {
    token.value = null;
    user.value = null;
    sessionStorage.removeItem('gym-user-token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const setUser = (data) => {
    user.value = data;
  };

  const rehydrate = async () => {
    if (isLoggedIn){
      const { data } = await api.get('/user/profile')
      user.value = data;
    }
  }

  return {
    token, user, isLoggedIn,
    login, logout, setUser, rehydrate
  };
}, 
{
  persist: {
    key: 'auth',
    storage: sessionStorage,
    paths: ['user', 'token'],
  },
});
