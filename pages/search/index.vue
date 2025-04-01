<template>
<div class="searchPage container max-w-screen-xl mx-auto mb-4 px-4 py-4">
    <h2 v-show="searchResults.length" class="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">Search results for {{ route.query.q }}</h2>
    <h2 v-show="!searchResults.length" class="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">No results Found for {{ route.query.q }}</h2>
    <div class="movie-list-grid">
        <MovieCard v-for="movie in searchResults" :key="movie.id" :movie="movie" width="w180" />
    </div>
</div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import MovieCard from "@/components/MovieCard.vue";
const route = useRoute();
const searchResults = ref([]);
const {$api} = useNuxtApp();

const searchMovies = async () => {
    try {
        const response = await $api.get("search/movie", {
            params: {
                query: route.query.q,
            },
        });
        searchResults.value = response.results;
    } catch (error) {
        console.error("Failed to fetch search results:", error);
    }
};

watch(() => route.query.q, searchMovies);

onMounted(() => {
    searchMovies();
});
</script>
<style>
.searchPage {
    padding-top: 100px;
    height: 100vh;
}
.movie-list-grid {
   display: flex;
   flex-wrap: wrap;
   gap: 25px;
}
</style>