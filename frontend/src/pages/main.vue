<template>
<div class="homepage">
    <div class="nav-section">
        <NavBar/>
    </div>
    <div class="content-area">
        <router-view/>
        <footer>@2025 DJ Unknown</footer>
    </div>
</div>
</template>

<script setup>
import NavBar from '../components/navbar.vue';
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
}

footer {
    margin-top: 1rem;
    text-align: center;
    background-color: var(--background-secondary);
}
</style>