<template>
<div class="homepage">
    <section class="hero-section">
        <img src="../../assets/banner.jpg">
        <h1 class="hero-header">Unleash your potential</h1>
        <button @click="navigate" class="button-primary">Explore...</button>
    </section>
</div>
</template>
    
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigate = () => {
    router.push('/exercises');
}

onMounted(() => {
});

onUnmounted(() => {
  
})
</script>

<style scoped>
h1 {
    text-transform: uppercase;
    font-size: calc(1.5rem + ((1vw - 0.48rem) * 0.6944));
    text-align: center;
}
.hero-header {
    width: 100%;
    font-size: calc(2rem + ((1vw - 0.48rem) * 2.7778));
}

.homepage {
    overflow-y: hidden;
}

section {
    margin-bottom: 1rem;
}

.hero-section {
    width: 100%;
    position: relative;
}

.hero-section>img{
    display: block;
    width: 100%;
    height: auto;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.hero-section>img:hover{
    opacity: 0.5;
}

.hero-section>h1{
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
}

.hero-section>button{
    position: absolute;
    top: 66%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    padding: 1rem 4rem;
}

.exercise-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    justify-items: center;
    padding: 1rem;
}

@media (max-width: 768px) {
    h1 {
        font-size: 1.5rem;
    }
    .hero-header {
        font-size: 2rem;
    }
    .exercise-grid{
        grid-template-columns: 1fr 1fr;
    }
}
</style>