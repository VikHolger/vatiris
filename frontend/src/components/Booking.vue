<template>
    <div style="text-align: center;">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error }}</div>
        <h>Test</h>
    </div>
</template>

<script setup lang="ts">
import useEventBus from "@/eventbus"
import { ref } from "vue"

const props = defineProps<{ src: string }>()
const iframe = ref()

// Set up event bus listener
const bus = useEventBus();
  bus.on("refresh", () => {
    console.log("Refresh")
  });
</script>
