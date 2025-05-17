<template>
  <div class="article-detail-page">
    <section v-if="loading" class="status">Loading…</section>
    <section v-else-if="error" class="status error">{{ error }}</section>
    <section v-else>
      <h1>{{ article.title }}</h1>
      <p class="meta">
        {{ formattedDate }} •
        <span v-for="(cat, i) in article.categories" :key="cat">
          {{ cat }}<span v-if="i < article.categories.length - 1">, </span>
        </span>
      </p>

      <img v-if="article.imageUrl" :src="article.imageUrl" alt="Article image" />

      <div class="article-content" v-html="article.content"></div>

      <router-link to="/articles" class="button-secondary back-btn">
        ← Back to Articles
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import { formatDate } from '../../utils/helper';
const route   = useRoute();
const loading = ref(true);
const error   = ref('');
const article = ref(null);

const formattedDate = computed(() => {
  return article.value
    ? formatDate(article.value.createdAt)
    : '';
});

async function fetchArticle() {
  loading.value = true;
  try {
    const { id } = route.params;
    const res = await api.get(`/shared/article/${id}`);
    article.value = res.data;
  } catch (err) {
    error.value = err.response?.data || err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchArticle);
</script>

<style scoped>
.article-detail-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.status {
  text-align: center;
  padding: 2rem;
}
.status.error {
  color: #f44336;
}

h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.meta {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  object-fit: cover;
}

.article-content {
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-block;
  margin-top: 1rem;
}
</style>
