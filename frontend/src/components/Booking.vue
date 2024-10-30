<template>
  <div style="height: 30px; background: #666">
    <v-btn
      variant="text"
      rounded="0"
      size="small"
      :color="ESAA ? 'white' : 'grey-lighten-1'"
      @click="ESAA = !ESAA"
      >ESAA</v-btn
    >
    <v-btn
      variant="text"
      rounded="0"
      size="small"
      :color="FIR.length > 0 ? 'white' : 'grey-lighten-1'"
      @click="adFilter = ''"
      >FIRs
      <v-menu
        activator="parent"
        transition="slide-y-transition"
        :close-on-content-click="false"
      >
      <v-list density="compact">
        <v-list-item
          @click="EKDK = !EKDK"
          :class="EKDK ? '' : 'text-grey'"
        >
          <v-list-item-title>EKDK</v-list-item-title>
        </v-list-item>
      </v-list>
      </v-menu>
    </v-btn>
    
    <v-btn
      variant="text"
      rounded="0"
      size="small"
      :color="EKDK ? 'white' : 'grey-lighten-1'"
      @click="EKDK = !EKDK"
      >EKDK</v-btn
    >
    <v-btn
      variant="text"
      rounded="0"
      size="small"
      :color="EFIN ? 'white' : 'grey-lighten-1'"
      @click="EFIN = !EFIN"
      >EFIN</v-btn
    >
    <v-btn
      variant="text"
      rounded="0"
      size="small"
      :color="ENOR ? 'white' : 'grey-lighten-1'"
      @click="ENOR = !ENOR"
      >ENOR</v-btn
    >
  </div>
  <div>
    <h1>Test</h1>
  </div>
</template>

<script setup lang="ts">
import useEventBus from "@/eventbus"
import { ref, reactive } from "vue"

const ESAA = ref(true)
const EKDK = ref(false)
const EFIN = ref(false)
const ENOR = ref(false)

const FIR = reactive(["ALL"])

const adFilter = ref("")

// Set up event bus listener
const bus = useEventBus();
  bus.on("refresh", () => {
    console.log("Refresh")
  });
</script>
