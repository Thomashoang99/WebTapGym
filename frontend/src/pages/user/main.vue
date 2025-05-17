<!--The main layout-->
<template>
<div class="homepage">
    <div class="nav-section">
        <NavBar/>
    </div>
    <div class="content-area">
        <router-view/>
        <footer>@2025 DJ Unknown</footer>
    </div>
    <button v-if="!cartVisible && authStore.isLoggedIn" class="cart-toggle" @click="toggleCart">Cart</button>
    <Cart :visible="cartVisible" @close="toggleCart" />
</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import NavBar from '../../components/navbar.vue';
import Cart from '../../components/cart.vue';

const authStore = useAuthStore();
const cartVisible = ref(false);

function toggleCart() {
  cartVisible.value = !cartVisible.value;
}

watch(
    () => authStore.isLoggedIn,
    (loginStatus) => {
    if (loginStatus === false)
        cartVisible.value = false;  
})
</script>

<style scoped>
.nav-section {
    position: fixed;
    width: 100vw; height: 8vh;
    top: 0; left: 0;
}

.content-area {
    position: fixed;
    width: 100vw;
    top: 8vh;
    bottom: 0;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-base-color: aqua;
    scrollbar-color: var(--background-secondary);
}

footer {
    margin-top: 1rem;
    text-align: center;
    background-color: var(--background-secondary);
}

.cart-toggle {
  position: fixed;
  bottom: 16px;
  right: 16px;
  padding: 0.75rem 1.25rem;
  background: var(--accent-primary);
  color: var(--text-primary);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 1001;
}
</style>