import { defineStore } from "pinia"
import { ref, watch } from "vue"

export const useSettingsStore = defineStore("settings", () => {
    const windowSnapping = ref(true)
    const metreportFlash = ref(true)
    const metsensorFlash = ref(false)
    const enablePLS = ref(false)
    const plsLogic = ref("CID")
    const useVatsimConnect = ref(true)
    const cid1 = ref("")
    const cid2 = ref("")
    const position1 = ref("")
    const position2 = ref("")

    if ("settings" in localStorage) {
        try {
            const settings = JSON.parse(localStorage.settings)
            if ("windowSnapping" in settings) windowSnapping.value = settings.windowSnapping
            if ("metreportFlash" in settings) metreportFlash.value = settings.metreportFlash
            if ("metsensorFlash" in settings) metsensorFlash.value = settings.metsensorFlash
            if ("enablePLS" in settings) enablePLS.value = settings.enablePLS
            if ("plsLogic" in settings) plsLogic.value = settings.plsLogic
            if ("useVatsimConnect" in settings) useVatsimConnect.value = settings.useVatsimConnect
            if ("cid1" in settings) cid1.value = settings.cid1
            if ("cid2" in settings) cid2.value = settings.cid2
            if ("position1" in settings) position1.value = settings.position1
            if ("position2" in settings) position2.value = settings.position2
        } catch (e: any) {
            console.error("Failed to parse settings", e)
            delete localStorage.settings
        }
    }

    watch([
        windowSnapping,
        metreportFlash,
        metsensorFlash,
        enablePLS,
        plsLogic,
        useVatsimConnect,
        cid1,
        cid2,
        position1,
        position2
    ], () => {
        localStorage.settings = JSON.stringify({
            windowSnapping: windowSnapping.value,
            metreportFlash: metreportFlash.value,
            metsensorFlash: metsensorFlash.value,
            enablePLS: enablePLS.value,
            plsLogic: plsLogic.value,
            useVatsimConnect: useVatsimConnect.value,
            cid1: cid1.value,
            cid2: cid2.value,
            position1: position1.value,
            position2: position2.value
        })
    })

    return {
        windowSnapping,
        metreportFlash,
        metsensorFlash,
        enablePLS,
        plsLogic,
        useVatsimConnect,
        cid1,
        cid2,
        position1,
        position2,
    }
})