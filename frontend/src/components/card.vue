<template>
<div class="exercise-card">
    <img :src="exercise.imageUrl" :alt="exercise.name" />
    <div class="exercise-content">
        <h3>{{ exercise.name }}</h3>
        <p class="exercise-info">
            <span style="font-weight: bold;">{{ exercise.difficulty }}</span>
            &Tab;&#183;&Tab;
            <span>
                {{ formattedBodyParts }}
            </span>
        </p>
        <p>{{ formattedDescription }}</p>
    </div>
    <div class="card-footer">
        <button class="button-primary learn-more" @click="onClick">LEARN MORE</button>
    </div>
</div>
</template>

<script setup>
import { computed, defineProps } from 'vue';


const props = defineProps({
    exercise: { type: Object, required: true }
});

const truncateLimit = 100;
const formattedDescription = computed(() => {
    return props.exercise.description.length > truncateLimit ?
    props.exercise.description.slice(0, truncateLimit) + '...' :
    props.exercise.description;
})

const formattedBodyParts = computed(() => {
    return props.exercise.bodyParts.join(' | ');
});

function onClick() {
    alert('Button clicked');
};
</script>

<style scoped>
.exercise-card {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--text-secondary);
    background-color: var(--background-secondary);
    overflow: hidden;
    width: 100%;
    max-height: 75vh;
}

.exercise-card>* {
    margin-bottom: 0.5rem;
}


.exercise-content>*{
    margin-bottom: 0.5rem;
}

img {
    width: 100%;
    height: 30vh;
    object-fit: cover;
}

.card-footer {
    margin-top: auto;
    margin-bottom: 0;
}

.learn-more {
    background-color: var(--accent-primary);
    width: 100%;
    padding: 0.5rem 0;
    color: var(--text-primary);
    cursor: pointer;
}
</style>