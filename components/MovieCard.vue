<template>
    <div class="movie-card" @click="goToDetails" :class="width">
        <img :src="tmdbImage()(movie.poster_path, 'original')" :alt="movie.title" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
    movie: Object,
    width: {
        default: 'w180',
    },
});
const route = useRoute();
const router = useRouter();

const goToDetails = () => {
    router.push({
        path: `/movie/${props.movie.id}`,
        query: { q: route.query.q }
    });
};
</script>

<style scoped>
.movie-card {
    position: relative;
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
}
.movie-card.w180 {
    max-width: 180px;
    flex: 0 0 180px;
}
.movie-card.w200 {
    max-width: 32%;
    flex: 0 0 32%;
    margin-bottom: 20px;
}

.movie-card:hover {
    transform: scale(1.05);
}

.movie-card img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}
@media screen and (min-width: 320px)  and (max-width: 767px) {
    .movie-card.w180 {
        max-width: 120px;
        flex: 0 0 120px;
    }
    .movie-card.w200 {
        max-width: 31%;
        flex: 0 0 31%;
        margin-bottom: 10px;
    }
    
}
</style>