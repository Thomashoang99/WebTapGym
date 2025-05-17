<template>
  <div class="wrapper">
    <div class="checkout-page">
    <header class="checkout-header">
      <h1>Checkout</h1>
      <div class="progress-bar">
        <div class="progress-step completed">
          <span>1</span>
          <small>Cart</small>
        </div>
        <div class="progress-step active">
          <span>2</span>
          <small>Review &amp; Pay</small>
        </div>
      </div>
    </header>

    <section class="checkout-content">
      <div v-if="!cartItems.length" class="empty">
        Your cart is empty.
      </div>

      <div v-else>
        <ul class="item-list">
          <li v-for="item in cartItems" :key="item.id" class="item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">{{ formatNumber(item.price) }}đ</span>
          </li>
        </ul>

        <div class="total-section">
          <div class="total-label">Total</div>
          <div class="total-amount">{{ formatNumber(totalPrice) }}đ</div>
        </div>

        <button
          class="button-primary pay-btn"
          :disabled="loading"
          @click="payNow"
        >
          <span v-if="!loading">Pay Now</span>
          <span v-else>Processing…</span>
        </button>

        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </section>
  </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import api from '../../api';
import { formatNumber } from '../../utils/helper';

const router    = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const cartItems  = computed(() => cartStore.cart);
const totalPrice = computed(() => cartStore.totalPrice);

const loading = ref(false);
const error   = ref('');

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: '/checkout' } });
  }
});

async function payNow() {
  loading.value = true;
  error.value   = '';

  try {
    console.log(cartItems);

    const programs = cartStore.cart.map(p => ({ id: p.id, price: p.price }));
    const amount = cartStore.totalPrice;
    const { data } = await api.post('/payment/vnpay/create-payment-url', {
      programs,
      amount
    });
    window.location.href = data.paymentUrl;
  } catch (err) {
    console.log(err);
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wrapper {
    min-height: 100vh;
    background: 
        linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),
        url('../assets/banner.jpg') no-repeat center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}
.checkout-page {
  position: relative;
  background: var(--background-secondary);
  width: 800px;
  padding: 1rem;
  border-radius: 8px;
}

/* Header & Progress */
.checkout-header {
  text-align: center;
  margin-bottom: 2rem;
}
.checkout-header h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  margin-bottom: 1rem;
}
.progress-bar {
  display: flex;
  justify-content: center;
  gap: 2rem;
}
.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
}
.progress-step span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--background-main);
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
  font-weight: bold;
}
.progress-step.completed span {
  background: var(--accent-primary);
  color: var(--text-primary);
}
.progress-step.active span {
  background: var(--accent-secondary);
  color: var(--text-primary);
}
.progress-step small {
  font-size: 0.75rem;
}

.checkout-content {
  padding: 0 1rem;
}
.empty {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
}
.item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #333;
}
.item-name {
  font-weight: 500;
}
.item-price {
  font-family: 'Oswald', sans-serif;
}

/* Total */
.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}
.total-label {
  font-size: 1.25rem;
}
.total-amount {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
}

/* Pay button */
.pay-btn {
  width: 100%;
  padding: 0.75rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
}
.pay-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error */
.error {
  margin-top: 1rem;
  text-align: center;
  color: #f44336;
}
</style>
