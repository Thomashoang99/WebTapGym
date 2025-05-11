<template>
<div class="homepage">
    <section class="hero-section">
        <img src="../assets/banner.jpg">
        <h1 class="hero-header">Unleash your potential</h1>
    </section>
    <section class="exercise-list" >
        <h1>LATEST EXERCISES</h1>
        <div class="exercise-grid">
            <Card 
            v-for="exercise in latestExercises" :key="exercise._id"
            :exercise="exercise"/>
        </div>
    </section>
    <section class="program-list">
        <h1>MOST POPULAR PROGRAMS</h1>
    </section>
</div>
</template>
    
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Card from '../components/card.vue';
import api from '../api';

const latestExercises = ref([]);
const loaded = ref(false); 

const fetchlatestExercises = async () => {
    try {
        const res = await api.get(`/shared/exercise?page=1&limit=4`);
        latestExercises.value = res.data.results;
        console.log('Fetch successfully');
        loaded.value = true;
    } 
    catch (err) {
        console.log(err);
    }
};

onMounted(() => {
   fetchlatestExercises()
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
}

.hero-section>h1{
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
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