<template>
    <div class="home">
        <section class="hero"
            :style="{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0) 100%), url(${tmdbImage()(latestMovie.backdrop_path, 'original')})` }">
            <div class="container max-w-screen-xl mx-auto px-4 py-4">
                <div class="info">
                    <h2>{{ latestMovie.title }}</h2>
                    <p class="opacity-80">{{ genreNames.join(", ") }}</p>
                    <div class="actions flex gap-4 mt-4">
                        <div class="play-btn">
                            <customButton text="Play" @click="$router.push('/movie/'+ latestMovie.id)" icon="/play-big.png" />
                        </div>
                        <div class="more-info">
                            <customButton text="More Info" @click="$router.push('/movie/'+ latestMovie.id)" icon="/information-circle.png" variant="transparent" />
                        </div>
                    </div>
                </div>
                <div class="top10">
                    <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">Top 10 Movies</h2>
                    <div class="movie-list">
                        <movieCard v-for="movie in top10Movies" :key="movie.id" :movie="movie" />
                    </div>
                </div>
            </div>
        </section>
        <section id="now-playing" class="container max-w-screen-xl mx-auto mb-4 px-4 py-4">
            <div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">Now Playing</h2>
                <div class="movie-list">
                    <movieCard v-for="movie in nowPlaying" :key="movie.id" :movie="movie" />
                </div>
            </div>
        </section>
        <section id="popular" class="container max-w-screen-xl mx-auto mb-4 px-4 py-4">
            <div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">Popular Movies</h2>
                <div class="movie-list">
                    <movieCard v-for="movie in popularMovies" :key="movie.id" :movie="movie" />
                </div>
            </div>
        </section>
        <section id="upcoming" class="container max-w-screen-xl mx-auto mb-4 px-4 py-4">
            <div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">Upcoming</h2>
                <div class="movie-list">
                    <movieCard v-for="movie in upcoming" :key="movie.id" :movie="movie" />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp();
import { ref, onMounted } from "vue";
import customButton from "@/components/customButton.vue";
import movieCard from "@/components/movieCard.vue";
const { getGenreNames } = findGenres();
const genreNames = ref([]);
const latestMovie = ref({});
const top10Movies = ref([]);
const popularMovies = ref([]);
const nowPlaying = ref([]);
const upcoming = ref([]);

const fetchLatestMovie = async () => {
    try {
        const response = await $api.get("trending/movie/day");
        const randomIndex = Math.floor(Math.random() * response.results.length);
        latestMovie.value = response.results[randomIndex];
        genreNames.value = await getGenreNames(latestMovie.value.genre_ids);
    } catch (error) {
        console.error("Failed to fetch latest movie:", error);
    }
};

const fetchTop10Movies = async () => {
    try {
        const response = await $api.get("movie/top_rated");
        top10Movies.value = response.results.slice(0, 10);
    } catch (error) {
        console.error("Failed to fetch top 10 movies:", error);
    }
};

const fetchPopularMovies = async () => {
    try {
        const response = await $api.get("movie/popular");
        popularMovies.value = response.results;
    } catch (error) {
        console.error("Failed to fetch popular movies:", error);
    }
};

const fetchNowPlaying = async () => {
    try {
        const response = await $api.get("movie/now_playing");
        nowPlaying.value = response.results;
    } catch (error) {
        console.error("Failed to fetch now playing movies:", error);
    }
};

const fetchUpcoming = async () => {
    try {
        const response = await $api.get("movie/upcoming");
        upcoming.value = response.results;
    } catch (error) {
        console.error("Failed to fetch upcoming movies:", error);
    }
};

onMounted(() => {
    fetchLatestMovie();
    fetchTop10Movies();
    fetchPopularMovies();
    fetchNowPlaying();
    fetchUpcoming();
});
</script>

<style scoped>
section.hero {
    width: 100%;
    height: 100vh;
    background-size: cover !important;
    background-position: center;
    background-blend-mode: multiply;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    flex-direction: column;
}

.info h2 {
    font-size: 2.5rem;
    font-weight: 400;
    margin-bottom: 1rem;
}

.info p {
    font-size: 1.2rem;
    max-width: 600px;
}

.actions {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.top10 {
    margin-top: 50px;
}

.movie-list {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 20px;
}
</style>