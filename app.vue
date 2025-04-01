<template>
  <div>
    <Header />
    <div v-if="loading" class="loading-overlay">
      <span class="loader"></span>
    </div>
    <Transition name="fade" mode="out-in">
      <NuxtPage />
    </Transition>
  </div>
</template>
<script setup>
const loading = useState("loading");
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
    },
  ],
  title: "MiniFlix",
});
import Header from "@/components/Header.vue";
</script>
<style>
body {
  font-family: "Inter", sans-serif;
  background-color: black;
  color: #fff;
  margin: 0;
  padding: 0;
}

/* Global Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>