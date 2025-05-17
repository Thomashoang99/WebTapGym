import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cart = ref([]);
  try {
    const data = sessionStorage.getItem('cart');
    cart.value = data ? JSON.parse(data) : [];
  } catch (err) {
    cart.value = [];
  }
  watch(cart, (updatedCart) => {
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  },
  { deep: true })

  const totalPrice = computed(() => 
    cart.value.reduce((total, item) => total + item.price, 0)
  );

  function addToCart(program) {
    if (!cart.value.some(i => i.id === program._id)){
        cart.value.push({
            id: program._id,
            name: program.name,
            price: program.price
         });
         return true;
       }
       return false;
    }

    function dropFromCart(programId) {
        cart.value = cart.value.filter(p => p.id !== programId);
    }

    function clearCart(){
        cart.value = [];
        sessionStorage.removeItem('cart');
    }

  return { cart, totalPrice, addToCart, dropFromCart, clearCart };
});
