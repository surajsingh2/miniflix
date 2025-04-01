<template>
    <div class="movie-details"
        :style="{ background: `url(${tmdbImage()(movie.backdrop_path, 'original')}), rgba(0,0,0,0.9)` }">
        <div class="movie-container">
            <div class="video-container">
                <div v-show="!videos.length" class="no-trailer-message">Trailer not available</div>
                <div v-show="videos.length" ref="videoContainer" class="video-wrapper"></div>

                <!-- Overlay -->
                <div class="overlay"></div>
                <div class="controls" v-if="videos.length">
                    <customButton :text="isPlaying ? 'Pause' : 'Play'" @click="togglePlayPause" :icon="isPlaying ? '/pause-big.png' : '/play-big.png'" />
                    <span @click="toggleMute">
                        <img v-show="isMuted" src="/muted.png" alt="muted">
                        <img v-show="!isMuted" src="/unmuted.png" alt="sound">
                    </span>
                </div>
            </div>
            <div class="movie-info">
                <div class="general-info">
                    <div class="release_runtime">{{ releaseYear }} . {{ runTime }}</div>
                    <div class="title">{{ movie.title }}</div>
                    <div class="overview">{{ movie.overview }}</div>
                </div>
                <div class="cast_genre-info">
                    <div class="casts" v-if="cast.length">
                        <span class="subheading">Cast: </span>
                        <span>{{ cast.join(", ") }}</span>

                    </div>
                    <div class="genres">
                        <span class="subheading">Genres: </span>
                        <span>{{ genres.join(", ") }}</span>
                    </div>
                </div>
            </div>

            <div class="similar-movies">
                <h2>More like this</h2>
                <div class="movie-list">
                    <movieCard v-for="movie in similarMovies" :key="movie.id" :movie="movie" width="w200"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import movieCard from "@/components/movieCard.vue";
import customButton from "@/components/customButton.vue";
const { fetchMovieCast } = findMovieCast();
const { $api } = useNuxtApp();
const route = useRoute();

const videos = ref([]);
const player = ref(null);
const isMuted = ref(true);
const isPlaying = ref(true)
const videoContainer = ref(null);
const movie = ref({});
const cast = ref([]);
const genres = ref([]);
const similarMovies = ref([]);
const releaseYear = computed(() => movie.value.release_date?.split("-")[0]);
const runTime = computed(() => {
    const hours = Math.floor(movie.value.runtime / 60);
    const minutes = movie.value.runtime % 60;
    return `${hours}h ${minutes}m`;
});
const fetchMovieData = async () => {
    try {
        const response = await $api.get(`/movie/${route.params.id}`);
        movie.value = response;
        genres.value = response.genres.map((g) => g.name);
    } catch (error) {
        console.error("Failed to fetch movie details:", error);
    }
};

const fetchMovieVideos = async () => {
    try {
        const response = await $api.get(`/movie/${route.params.id}/videos`);
        videos.value = response.results;
    } catch (error) {
        console.error("Failed to fetch movie videos:", error);
    }
};

const fetchSimilarMovies = async () => {
    try {
        const response = await $api.get(`/movie/${route.params.id}/similar?&language=en-US&page=1`);
        similarMovies.value = response.results.slice(0, 9); // Return only the top 10 similar movies
    } catch (error) {
        console.error(`Error fetching similar movies for movie ${route.params.id}:`, error);

    }
};

// Extract first YouTube trailer
const trailerKey = computed(() => {
    const trailer = videos.value.find((v) => v.site === "YouTube" && v.type === "Trailer");
    return trailer ? trailer.key : null;
});

// Load YouTube API and wait for `YT` to be available
const loadYouTubeAPI = () => {
    return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
            resolve();
            return;
        }

        // Inject script only if not already loaded
        if (!document.getElementById("youtube-api-script")) {
            const script = document.createElement("script");
            script.id = "youtube-api-script";
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            document.body.appendChild(script);
        }

        // Poll for `YT` until it's available
        const checkYT = setInterval(() => {
            if (window.YT && window.YT.Player) {
                clearInterval(checkYT);
                resolve();
            }
        }, 100);
    });
};


const initYouTubePlayer = async () => {
    if (!trailerKey.value || !videoContainer.value) return;
    await loadYouTubeAPI();
    player.value = new YT.Player(videoContainer.value, {
        height: "100%",
        width: "100%",
        videoId: trailerKey.value,
        playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: trailerKey.value,
            controls: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            rel: 0,
            playsinline: 1,
            disablekb: 1,
            fs: 0,
            showinfo: 0
        },
        events: {
            onReady: (event) => {
                event.target.mute();
            },
        },
    });
};

const toggleMute = () => {
    if (player.value) {
        if (isMuted.value) {
            player.value.unMute();
        } else {
            player.value.mute();
        }
        isMuted.value = !isMuted.value;
    }
};

const togglePlayPause = () => {
    if (player.value) {
        const state = player.value.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.value.pauseVideo();
            isPlaying.value = false;
        } else {
            player.value.playVideo();
            isPlaying.value = true;
        }
    }
};

watch(trailerKey, (newKey) => {
    if (newKey) {
        initYouTubePlayer();
    }
});

const toggleFullscreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (videoContainer.value.requestFullscreen) {
        videoContainer.value.requestFullscreen();
    }
};

onMounted(async () => {
    await fetchMovieData();
    await fetchMovieVideos();
    await loadYouTubeAPI();
    await fetchSimilarMovies();
    cast.value = await fetchMovieCast(route.params.id);
});
</script>

<style>
.movie-details {
    background-size: cover !important;
    background-blend-mode: multiply;
    height: 100vh;
    position: fixed;
    width: 100%;
    overflow: auto;
}

.movie-container {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    top: 76px;
}

.video-container {
    position: relative;
    top: 0;
    width: 100%;
    height: 450px;
    /* 16:9 Aspect Ratio */
    max-height: 80vh;
    /* Prevent excessive height */
    overflow: hidden;
}

.video-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140%;
    /* Zoom in to remove black bars */
    height: 140%;
    transform: translate(-50%, -50%);
}

.overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.no-trailer-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 1.5rem;
    color: white;
    background: rgba(0, 0, 0, 0.7);
    text-align: center;
}

.controls {
    position: absolute;
    width: calc(100% - 40px);
    bottom: 0;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 3;
    cursor: pointer;
}

.controls span {
    cursor: pointer;
}

.controls img {
    width: 24px;
    height: 24px;
}

button {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
}

button:hover {
    background: rgba(255, 255, 255, 0.4);
}

.movie-details h2 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.movie-details p {
    font-size: 1rem;
    opacity: 0.8;
}

.movie-info {
    display: flex;
    padding: 20px;
    gap: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.title {
    font-size: 36px;
    font-weight: 500;
    margin: 10px 0;
}

.cast_genre-info {
    max-width: 30%;
    flex: 0 0 30%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.subheading {
    font-weight: 200;
    color: #898989;
}

.similar-movies {
    padding: 0 20px;
}

.similar-movies h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    margin-top: 10px;
}

.similar-movies .movie-list {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    flex-wrap: wrap;
    padding-bottom: 20px;
    justify-content: flex-start;
}

@media screen and (min-width: 320px)  and (max-width: 767px) {
    .video-container {
        height: 200px;
    }
    .controls {
        width: 100%;
        padding: 10px;
    }
    .movie-info {
        flex-direction: column;
        gap: 20px;
        padding:15px 5px;
    }

    .cast_genre-info {
        max-width: 100%;
        flex: 0 0 100%;
    }

    .similar-movies {
        padding: 5px;
    }

    .similar-movies .movie-list {
        gap: 10px;
    }
}
</style>
