<template>
    <header class="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-b from-black/10 to-black/5">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <nav class="flex items-center gap-6">
                <div class="logo">
                    <NuxtLink to="/">
                        <img src="/miniflix.png" alt="miniflix" class="w-36">
                    </NuxtLink>
                </div>
                <!-- Desktop Links -->
                <div class="hidden lg:flex links gap-6">
                    <NuxtLink to="#now-playing" class="text-white hover:text-gray-300">Now Playing</NuxtLink>
                    <NuxtLink to="#popular" class="text-white hover:text-gray-300">Popular</NuxtLink>
                    <NuxtLink to="#upcoming" class="text-white hover:text-gray-300">Upcoming</NuxtLink>
                </div>
            </nav>
            <div class="search flex items-center gap-4">
                <div class="search-bar relative">
                    <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Search"
                        class="pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                        <img src="/search-default.png" alt="search-icon" class="w-5 h-5">
                    </span>
                </div>
                <img class="hidden md:inline-flex avatar w-10 h-10 rounded-full" src="/avatar.png" alt="profile-img">
            </div>
        </div>
    </header>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";

const route = useRoute();
const router = useRouter();
const searchQuery = ref("");
const isMobileMenuOpen = ref(false); // State to toggle mobile menu

// Sync the input value with the route query on component mount
onMounted(() => {
    searchQuery.value = route.query.q || ""; // Initialize with the query parameter or an empty string
});

// Watch for changes in the searchQuery and update the route query
watch(searchQuery, () => {
    if (!searchQuery.value) {
        router.back(); // Go back to the previous route
    } else {
        router.push({ path: "/search", query: { q: searchQuery.value } });
    }
});

// Reset search query when navigating to the homepage
watch(() => route.path, (newPath) => {
    if (newPath === '/') {
        searchQuery.value = ''; // Reset the search query when on the homepage
    }
});
</script>

<style scoped>
@media screen and (min-width: 320px)  and (max-width: 767px) {
    .logo img {
        width: 100px;
    }
    .search-bar input {
        width: 150px;
    }
}
</style>
