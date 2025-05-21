<template>
  <div class="article-form-page">
    <h3 class="header">{{ props.readOnly ? 'View ' : (isEditing ? 'Edit ' : 'New ') }}Article</h3>
    <form @submit.prevent="save" enctype="multipart/form-data">
      <div class="field">
        <h5>Title</h5>
        <input type="text" v-model="form.title" :disabled="props.readOnly" required />
      </div>

      <div class="field">
        <h5>Summary (max 200 chars)</h5>
        <textarea v-model="form.summary" :disabled="props.readOnly" required></textarea>
      </div>

      <div class="field">
        <h5>Image</h5>
        <input type="file" @change="onFileChange" accept="image/*" :disabled="props.readOnly" />
        <img v-if="preview" :src="preview" class="preview-img" />
      </div>

      <div class="field">
        <h5>Category</h5>
        <select v-model="form.categories" :disabled="props.readOnly" required>
          <option v-for="c in categoriesList" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field">
        <h5>Tags (comma-separated)</h5>
        <input type="text" v-model="form.tags" :disabled="props.readOnly"/>
      </div>

      <div class="field">
        <h5>Content</h5>
        <QuillEditor style="height: 200px" 
        contentType="html" 
        :v-model:content="form.content" 
        :readOnly="props.readOnly"
        ref="quillEditor"
        @update:content="onEditorChange" />
      </div>

      <button v-if="!props.readOnly" class="button-primary" type="submit" :disabled="saving">
        {{ saving ? 'Saving…' : isEditing ? 'Update' : 'Create' }}
      </button>
      <button class="button-secondary" @click="emit('close')" type="button">
        Cancel
      </button>
    </form>

    <div v-if="error" class="status error">{{ error }}</div>
  </div>
</template>

<script setup>
import { 
    reactive, ref, computed, onMounted,
    defineProps, defineEmits } from 'vue';
import api from '../../api';

const props = defineProps({
  articleId: { type: String, default: null },
  readOnly:  { type: Boolean, default: false }
});
const emit = defineEmits(['saved',  'close']);
const isEditing = computed(() => !!props.articleId);

const categoriesList = ['Nutrition', 'Training', 'Recovery'];

const form = reactive({
  title:      '',
  summary:    '',
  content:    '', //HTML content
  categories: '',
  tags:       ''
});

const file      = ref(null);
const preview   = ref('');
const saving    = ref(false);
const error     = ref('');

//For Quill
const quillEditor = ref(null);

function onEditorChange(html){
  form.content = html;
}

function onFileChange(e) {
  const f = e.target.files[0];
  if (f) {
    file.value = f;
    preview.value = URL.createObjectURL(f);
  }
}

onMounted(async () => {
  if (isEditing.value || props.readOnly) {
    try {
      const { data } = await api.get(`/shared/article/${props.articleId}`);
      form.title = data.title;
      form.content = data.content;
      form.summary = data.summary;
      form.categories = data.categories;
      form.tags = data.tags.join(',');
      console.log(form);
      preview.value   = data.imageUrl;
    } catch (err) {
      error.value = err.response?.data?.error || err.message;
    }
  }
});

async function save() {
  saving.value = true;
  error.value  = '';

  const fd = new FormData();
  fd.append('title', form.title);
  fd.append('summary', form.summary);
  fd.append('content', form.content);
  fd.append('categories', form.categories);

  const tagsList = form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
  tagsList.forEach(tag => fd.append('tags', tag));

  if (file.value) {
    fd.append('image', file.value);
  }

  try {
    if (isEditing.value) {
      await api.put(`/admin/article/${props.articleId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await api.post('/admin/article', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    emit('saved');
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
* {
  color: var(--text-primary);
}

.header {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.article-form-page {
  max-width: 800px;
  margin: 0 auto;
  color: var(--text-primary);
}
.field {
  margin-bottom: 1rem;
  width: 100%;
}
.field>h5 {
  color: var(--text-primary);
}
.field>*{
  width: 100%;
}
.field label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.field input[type="text"],
.field textarea,
.field select {
  width: 100%;
  padding: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid #333;
  border-radius: 4px;
}
.preview-img {
  margin-top: 0.5rem;
  max-width: 150px;
  border-radius: 4px;
}
.status.error {
  color: #f44336;
  margin-top: 1rem;
}
</style>
