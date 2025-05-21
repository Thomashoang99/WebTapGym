import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useExerciseStore = defineStore('exercise', () => {
  const exerciseList = ref([]) ;
  const isFetched = ref(false);

  const fetchExercises = async () => {
    if (isFetched.value){
        return;
    }
    else{
        const { data } = await api.get('/shared/exercise', 
        { params: { sortBy: 'name', sortOrder: 'asc', limit: 100 }});
      exerciseList.value = data.results;
      isFetched.value = true;
    }
  }

  function clearCache() {
      exerciseList.value  = []
      isFetched.value = false
    }

  return {
    exerciseList,
    isFetched,
    fetchExercises,
    clearCache
  }
});
