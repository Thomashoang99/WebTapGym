<template>
  <div class="cart-sidebar" :class="{ open: visible }">
    <header class="cart-header">
      <h2>Giỏ hàng</h2>
      <button class="close-btn" @click="$emit('close')">×</button>
    </header>

    <div class="cart-content">
      <div v-if="cartStatus.itemList.length === 0" class="empty">
        Giỏ hàng đang trống!
      </div>
      <ul v-else class="cart-items">
        <li v-for="item in cartStatus.itemList" :key="item.id" class="cart-item">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-price">{{ formatNumber(item.price) }}đ</span>
          <button class="remove-btn" @click="remove(item.id)">×</button>
        </li>
      </ul>
    </div>

    <footer class="cart-footer">
      <div class="total">
        Tổng: {{ formatNumber(cartStatus.totalPrice) }}đ
      </div>
      <button
        class="button-primary checkout-btn"
        :disabled="cartStatus.itemList.length === 0"
        @click="proceed"
      >
        Thanh toán
      </button>
    </footer>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { watch, reactive, onMounted } from 'vue';
import { formatNumber } from '../utils/helper';

const props = defineProps({ visible: Boolean });
const emit  = defineEmits(['close']);
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const cartStatus = reactive({
  itemList: [],
  totalPrice: 0
})

function remove(id) {
  cartStore.dropFromCart(id);
}

function proceed() {
  router.push('/checkout');
  emit('close');
}

async function fetchCartItems() {
  cartStatus.itemList = cartStore.cart;
  cartStatus.totalPrice = cartStore.totalPrice;
}

watch (
  [() => cartStore.cart],
  () => {
    cartStatus.itemList = cartStore.cart;
  },
  { deep: true }
);

watch(
  [() => cartStore.totalPrice],
  (newTotal, _) => {
    const dur = 300;  
    const startTs = performance.now();                //Mark start time of this animation
    const startVal = cartStatus.totalPrice;           //Ensure smooth animation when user update cart mid-way

    const step = ts => {
      const t = Math.min((ts - startTs) / dur, 1);                   // % animation progress done
      cartStatus.totalPrice = startVal + (newTotal - startVal) * t; // Update displayed price, by interpolation
      if (t < 1) requestAnimationFrame(step);                       // Trigger new frame when not 100% done
    };
    requestAnimationFrame(step);  // Kick off the animation
  }
)

watch(
  () => authStore.isLoggedIn,
  (loginStatus) => {
    if (loginStatus === false)
        cartStore.clearCart(); //Clear cart on logout
});

onMounted(fetchCartItems);
</script>

<style scoped>
.cart-sidebar {
  position: fixed;
  top: 8vh;
  right: -320px;
  width: 300px;
  bottom: 0;
  background: var(--background-secondary);
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
.cart-sidebar.open {
  right: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-primary)
}

.cart-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}
.empty {
  text-align: center;
  color: #888;
}
.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.item-name {
  flex: 1;
}
.item-price {
  margin: 0 0.5rem;
}
.remove-btn {
  background: none;
  border: none;
  color: red;
  font-size: 1.25rem;
  cursor: pointer;
}

.cart-footer {
  padding: 0.5rem;
  border-top: 1px solid #eee;
}
.total {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.checkout-btn {
  width: 100%;
  padding: 0.5rem;
}
.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
