<template>
    <v-app-bar color="#2b2d31" height="30" elevation="0">
        <system-menu />
        <main-menu @select="select" @unselect="unselect" />
        <v-spacer />
        <main-toolbar />
    </v-app-bar>
    <v-main>
        <template v-for="(win, id) in availableWindows">
            <Window
                v-if="id in windows.layout && windows.layout[id].enabled"
                :key="id"
                :id="'' + id"
                :title="win.title"
                :width="win.width"
                :height="win.height"
                :class="win.class"
            >
                <component :is="win.component" v-bind="win.props" />
            </Window>
        </template>
        <Welcome v-if="!Object.values(windows.layout).find((l) => l.enabled)" />
    </v-main>
</template>

<script setup lang="ts">
import SystemMenu from "@/components/menu/SystemMenu.vue"
import MainMenu from "@/components/menu/MainMenu.vue"
import MainToolbar from "@/components/menu/MainToolbar.vue"
import Window from "@/components/Window.vue"
import Welcome from "@/components/Welcome.vue"
import Metreport from "@/components/Metreport.vue"
import Metsensor from "@/components/Metsensor.vue"
import Notam from "@/components/Notam.vue"
import LfvEcharts from "@/components/LfvEcharts.vue"
import Smhi from "@/components/Smhi.vue"
import About from "@/components/About.vue"
import Image from "@/components/Image.vue"
import ECFMP from "@/components/ECFMP.vue"
import SApush from "@/components/SApush.vue"
import Iframe from "@/components/Iframe.vue"
import DCT from "@/components/DCT.vue"
import Notepad from "@/components/Notepad.vue"
import Aircraft from "@/components/Aircraft.vue"
import Alias from "@/components/Alias.vue"
import Booking from "@/components/Booking.vue"


import { onBeforeUnmount, onUnmounted, reactive, shallowReactive } from "vue"
import { useWindowsStore } from "@/stores/windows"

const windows = useWindowsStore()
const dct = useDctStore()

import { wxAirports } from "@/stores/wx"
import { useDctStore } from "@/stores/dct"
import directsData from '@/data/dct/directs.json'

export interface WindowSpec {
    title: string
    component: any
    props?: any
    class?: string
    width: string | number
    height: string | number
}

const availableWindows = shallowReactive({
    notam: {
        title: "NOTAM",
        component: Notam,
        width: 600,
        height: 600,
    },
    echarts: {
        title: "LFV eCharts",
        component: LfvEcharts,
        width: 600,
        height: 600,
    },
    smhi: {
        title: "SMHI",
        component: Smhi,
        width: 600,
        height: 600,
    },
    swc: {
        title: "SWC NORDEN",
        component: Image,
        props: { id: "swc", src: "https://aro.lfv.se/tor/nswc2aro.gif", refresh: "3600" },
        width: 480,
        height: 700,
    },
    vfr: {
        title: "VFR",
        component: Image,
        props: { id: "vfr", src: "https://aro.lfv.se/tor/vfrkarta.gif", refresh: "3610" },
        width: 400,
        height: 690,
    },
    ECFMP: {
        title: "ECFMP Flow Measures",
        component: ECFMP,
        width: 700,
        height: 300,
    },
    SApush: {
        title: "ESSA Pushback",
        component: SApush,
        width: 700,
        height: 600,
    },
    aircraft: {
        title: "Aircraft Types ICAO",
        component: Aircraft,
        width: 605,
        height: 400,
    },
    notepad: {
        title: "NOTEPAD",
        component: Notepad,
        width: 400,
        height: 500,
    },
    metartaf: {
        title: "METAR/TAF",
        component: MetarTaf,
        width: 700,
        height: 500,
    },
    alias: {
    title: "Text Alias",
    component: Alias,
    width: 650,
    height: 750,
    },
    booking: {
    title: "ATC Booking",
    component: Booking,
    width: 400,
    height: 400,
    }
} as any)

for (const icao of wxAirports) {
    availableWindows[`metrep${icao}`] = {
        title: `METREPORT ${icao}`,
        component: Metreport,
        props: { id: icao },
        width: 420,
        height: 380,
        class: "no-max",
    }
    availableWindows[`metsen${icao}`] = {
        title: `METSENSOR ${icao}`,
        component: Metsensor,
        props: { id: icao },
        width: 360,
        height: 380,
        class: "no-max",
    }
}

import("@/data/aip-airports.json").then((module) => {
    for (const airport of module.default) {
        for (const document of airport.documents) {
            availableWindows[`aip${document.prefix}`] = {
                title: `AIP ${document.prefix} ${document.name}`,
                component: Iframe,
                props: { src: `${document.url}#toolbar=0` },
                width: 800,
                height: 600,
            }
        }
    }
})

import Checklist from "@/components/Checklist.vue"
import MetarTaf from "@/components/MetarTaf.vue"
for (const name of ["open-position", "close-position", "handover-takeover", "rwy-change"]) {
    import(`@/data/checklist/${name}.json`).then((module) => {
        const checklist = module.default
        availableWindows[`checklist-${name}`] = {
            title: `Checklist - ${checklist.title}`,
            component: Checklist,
            props: { id: name, checklist },
            width: checklist.width || 600,
            height: checklist.height || 700,
        }
    })
}

for (const direct of directsData) {
    const id = direct.id.toLowerCase().replace(/\s+/g, '-')
    availableWindows[`coord-${id}`] = {
        title: `${direct.id} Directs`,
        component: DCT,
        props: { id: direct.id },
        width: 550,
        height: 700,
    }
}

function select(id: string | object) {
    let ctrl = false
    if (typeof id == "string" && id.startsWith("ctrl+")) {
        ctrl = true
        id = id.substr(5)
    }
    if (typeof id == "object") {
        // submenu
    } else if (id in availableWindows) {
        if (id in windows.winbox) {
            if (windows.winbox[id].min) windows.winbox[id].restore()
            windows.winbox[id].focus()
        } else {
            if (ctrl && availableWindows[id].props && availableWindows[id].props.src) {
                // ctrl-click on image/iframe opens in new tab
                window.open(availableWindows[id].props.src, "_blank")
            } else if (id in windows.layout) {
                windows.layout[id].enabled = true
            } else {
                windows.layout[id] = { enabled: true }
            }
        }
    } else if (id.startsWith && id.startsWith("https://")) {
        const [url, target] = id.split("|")
        window.open(url, target || "_blank")
    } else {
        console.error(`Unknown menu selection: ${id}`)
    }
}

function unselect(id: string) {
    console.log("unselect", id)
    if (id in windows.winbox) {
        windows.winbox[id].close()
    }
}

onBeforeUnmount(() => {
    windows.unmounting = true
})

onUnmounted(() => {
    windows.unmounting = false
})
;(window as any).select = select
</script>
