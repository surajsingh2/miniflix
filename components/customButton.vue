<template>
    <button class="custom-button" :class="variant">
        <span v-if="icon" class="icon"><img :src="icon" alt="icon"></span>
        <span>{{ text }}</span>
    </button>
</template>
<script setup>
defineProps({
    text: {
        type: String,
        default: "button",
    },
    icon: {
        type: String,
        default: "",
    },
    variant: {
        type: String,
        default: "solid",
    },
});
</script>
<style scoped>
.custom-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border: none;
    border-radius: 10px;
    background-color: #FFFFFF95;
    color: #323031;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}
.custom-button.transparent {
    background-color: #32303180;
    color: #FFFFFF;
    backdrop-filter: blur(10px);
}
/* .custom-button:hover {
    background-color: var(--primary-color-dark);
} */
.icon {
    margin-right: 0.5rem;
}
.icon img {
    width: 24px;
    height: 24px;
}
</style>