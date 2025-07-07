
"use client"

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Stars } from "@react-three/drei"
import { Suspense, useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, Minimize2, Maximize2 } from "lucide-react"
import type { MediaElementSourceNode } from "three"

// Preload the model
useGLTF.preload(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ranga%20to%20stone-m7YvIesppuKQRTa3UVqUlhH3glJq23.glb",
)

// Mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// All your tracks from the CDN
const TRACK_LIST = [
  "-%20-%20.mp3",
  "0_ranga.mp3",
  "01%20Chibz%20%26%20Ranga%20-%20Box%20Of%20Love.mp3",
  "1.%20Beast%20-%20Da%20Ranga.mp3",
  "1n2%20ranga.mp3",
  "02%20-Chibz%20%26%20Ranga%20-%20You%27re%20Enough%20%28Ft%20Martin%20Smith%29.mp3",
  "03%20-%20Chibz%20%26%20Ranga%20-%20Children%20of%20the%20Ghetto.mp3",
  "04%20-%20Chibz%20%26%20Ranga%20-%20Tidal%20Wave.mp3",
  "05%20-%20Chibz%20%26%20Ranga%20-%20Love%20and%20Kindness.mp3",
  "06%20-%20Chibz%20%26%20Ranga%20-%20Whose%20World%20Is%20This.mp3",
  "07%20-%20Chibz%20%26%20Ranga%20-%20Gratitude.mp3",
  "08%20-%20Chibz%20%26%20Ranga%20-%20Lizard.mp3",
  "09%20-%20Chibz%20%26%20Ranga%20-%20Liquid%20Love.mp3",
  "10%20-%20Chibz%20%26%20Ranga%20-%20Love%20and%20Kindness%20%282018%20version%29.mp3",
  "22%28earlysaxmix%29_oli.mp3",
  "22_oli.mp3",
  "38M8.mp3",
  "91%20hop%28inst%2991_ranga%20live.mp3",
  "93%20coast_ranga.mp3",
  "106_ranga%26harambe%28inst%29.mp3",
  "106_ranga%26harambe.mp3",
  "108.9_ranga.mp3",
  "109%20ram_ranga.mp3",
  "111%20dub%20tek.mp3",
  "116%20bananq.mp3",
  "120%20ee.mp3",
  "120¶_ranga.mp3",
  "124%20shake_ranga_bangas.mp3",
  "125vocal.mp3",
  "130healing%20dub.mp3",
  "180%20gram_ranga_bangas.mp3",
  "190gram.mp3",
  "Adushs.mp3",
  "aku%20aku_ranga.mp3",
  "alice_oli.mp3",
  "Alien_Lea%20%26%20Ol%27.mp3",
  "angel_oli%20.mp3",
  "Ark.mp3",
  "awh_demo_oli.mp3",
  "B7P8_ranga.mp3",
  "Bambooda_Ranga.mp3",
  "Bananas_ranga.mp3",
  "banderlirro%202.mp3",
  "Beat%201.mp3",
  "Beat%202.mp3",
  "Beat%207.mp3",
  "Beat%209.mp3",
  "beat1.mp3",
  "bermudea_ranga.mp3",
  "birdsong.mp3",
  "birdy%20dub_ranga%20dada%20shanti.mp3",
  "black%20voices%20%28edit%29_ranga.mp3",
  "blackenstine.mp3",
  "blackout.mp3",
  "BLACULA%20_.mp3",
  "blessing_ol.mp3",
  "can't%20do%20it%20wout%20you.mp3",
  "cape%20max.mp3",
  "Champ_Ol.mp3",
  "cheddar%20melt%20%28sex2%29_ranga.mp3",
  "chickery%20pot_ol'.mp3",
  "CHOICE.mp3",
  "conga%20fill%20.mp3",
  "conga_ranga.mp3",
  "deadlymood_ranga%202018.mp3",
  "Dinosaws_Ranga.mp3",
  "Dirty%20Looks.mp3",
  "djjelly_oli.mp3",
  "dogs%20tung_ranga_bangas.mp3",
  "Dreams%20On%20Contentment%20.mp3",
  "dreams%20on%20contentment_ranga.mp3",
  "dreamy%20trip_oli.mp3",
  "Drifty.mp3",
  "Dub%20tonight_Ranga.mp3",
  "earth_ft.jenome_ranga.mp3",
  "earth_ranga&jenome.mp3",
  "East%20End%20Mango.mp3",
  "Empty%20Hands%20Ft%20life's%20Good_Ranga.mp3",
  "Endless%20Good%20Weather_Ranga.mp3",
  "exploration.mp3",
  "faces.mp3",
  "fix_oli.mp3",
  "flat%2034%20pt2_ranga.mp3",
  "flipped%20egg_ranga.mp3",
  "FOESIL%20ROAD%202_oli%20%20.mp3",
  "FOESIL%20ROAD%203_oli%20%20.mp3",
  "forest_ranga.mp3",
  "forest_rangaM.mp3",
  "four%20walls_ranga.mp3",
  "funky%20fingerprints_ranga.mp3",
  "ghost160RNB.mp3",
  "Ginger%20Beer_Ranga.mp3",
  "Glass%20Tiger.mp3",
  "god2_Ol'.mp3",
  "goes%20round%20latin%20edit%20ranga.mp3",
  "gotta%20_ol'.mp3",
  "Great%20Ape%20%28Made%20In%20The%20Church%20Of%20The%20Sitnking%20Bishop%29.mp3",
  "green%20painting.mp3",
  "guess_ol.mp3",
  "Hard.mp3",
  "HARRY%20SIMM%20N%20RANGA%202.mp3",
  "hiptamine_ranga.mp3",
  "hitatattat_ol'.mp3",
  "Holla%20Back_Ranga.mp3",
  "home_ranga.mp3",
  "hoppyfun_.mp3",
  "How%20to%20play%20chess_Ranga.mp3",
  "i%20feel%20like%20u_ranga.mp3",
  "i%20see%20a%20way_ol'.mp3",
  "In%20Da%20City%20%28ft%20David%20Butler%29.mp3",
  "Interlude%202.mp3",
  "intro.mp3",
  "ip%20op_ranga.mp3",
  "ishvara_oli.mp3",
  "Jungle%20Law.mp3",
  "Kaa%20Moof_Ranga_Klangas%20.mp3",
  "Kilt_Ranga.mp3",
  "kreap_ranga.mp3",
  "LA%20SAGE.mp3",
  "last%20beat.mp3",
  "last%20nite%20beat%201.mp3",
  "last%20nite%20beat%202.mp3",
  "lgno_ranga.mp3",
  "lifes%20gone%20down%20low_ranga_edit.mp3",
  "Magic%20Woman.mp3",
  "married_ol'.mp3",
  "matias_ranga.mp3",
  "memorx_ranga%20%5Bunmastered%5D%20%281%29.mp3",
  "memorx_ranga%20%5Bunmastered%5D.mp3",
  "Mexico%2086'.mp3",
  "mezma_ol.mp3",
  "Monkey%20Feelinds%20UNMIXED.mp3",
  "moozy_oli.mp3",
  "night_oli.mp3",
  "nuclear%20war_ranga_bangas.mp3",
  "ol_ol.mp3",
  "ooo_Ol'%20%28beat%29.mp3",
  "orange%20jam%202.mp3",
  "other%20side%20of%20blue%20painting_ranga.mp3",
  "P8D_Ranga.mp3",
  "pancakes.mp3",
  "pank2_ranga%20%281%29.mp3",
  "pank2_ranga.mp3",
  "parrot_ol'.mp3",
  "peef%28draft%29_ranga.mp3",
  "percussion_ranga_bangas1.mp3",
  "Phoo.mp3",
  "Pryamid%203000%20%28Instrumental%20MPC%20version%29.mp3",
  "pure%20gold_chibz&ranga.mp3",
  "raise%20it_ol'.mp3",
  "Ranga%20-%20A%20Waltz%20On%20Venus%20%28M%29.mp3",
  "Ranga%20-%20Anger%20%26%20Happiness%20%20Dampening.mp3",
  "Ranga%20-%20Anger%20%26%20Happiness%20%20In%20My%20Face.mp3",
  "Ranga%20-%20Beats%20-%20Beat%203.mp3",
  "Ranga%20-%20Beats%20-%20Beat%204.mp3",
  "Ranga%20-%20Beats%20-%20Beat%205%266.mp3",
  "Ranga%20-%20Beats%20-%20Foundation%20ft%20Dada%20Shanti.mp3",
  "Ranga%20-%20Beats%20-%20Glass%20Tiger.mp3",
  "Ranga%20-%20Boss%20Man%20%28M%29.mp3",
  "Ranga%20-%20Capoweara%20%26%20Sleep%20-%20Capowera%202.mp3",
  "Ranga%20-%20Capoweara%20%26%20Sleep%20-%20Capowera.mp3",
  "Ranga%20-%20Capoweara%20%26%20Sleep%20-%20Sleep%203.mp3",
  "Ranga%20-%20Capoweara%20%26%20Sleep%20-%20Sleep.mp3",
  "Ranga%20-%20Dommm%20%28M%29.mp3",
  "Ranga%20-%20East%20End%20Mango%20%28M%29.mp3",
  "Ranga%20-%20Forget%20About%20It%20%28M%29.mp3",
  "RANGA%20-%20KIDS%20-%20BANGA%201.mp3",
  "Ranga%20-%20Nutz%20%28M%29.mp3",
  "Ranga%20-%20Pryamid%203000%20%28M%29.mp3",
  "Ranga%20-%20Reality%20Is%20%28M%29.mp3",
  "RANGA%20-%20TRANCE%20-%20BANGA%201.mp3",
  "Ranga%20-%20Zombies%20%28M%29.mp3",
  "Ranga%20Pizza%20-%20Pizza%20Slice%202.mp3",
  "Ranga%20Pizza%20-%20Pizza%20Slice%203.mp3",
  "Ranga.mp3",
  "Record%20Jam_Ranga.mp3",
  "records_ranga.mp3",
  "romance.mp3",
  "Rum_Ranga.mp3",
  "Runaway_Ranga.mp3",
  "Runaway2_Ranga.mp3",
  "Sassy_Ranga.mp3",
  "sensation.mp3",
  "settle_oli.mp3",
  "sex_ranga%20%5Bpremaster%5D.mp3",
  "sex_ranga.mp3",
  "shamanic%20hip%20hop.mp3",
  "shanty%20hop%28inst%2985_ranga%20live%20.mp3",
  "shi_ol'%20%281%29.mp3",
  "shi_ol'.mp3",
  "Shorts_.mp3",
  "Silver%20Bells%20%26%20Cockle%20Shells.mp3",
  "simplz.mp3",
  "Sky.mp3",
  "skye_ranga_bangas.mp3",
  "Small%20People.mp3",
  "soft%20and%20nice%202017%20ranga%20YOYOYO.mp3",
  "solar%20peeps_ol'.mp3",
  "Space%20Hopper_Ranga.mp3",
  "Star%20Kaff_Ranga.mp3",
  "Stomper.mp3",
  "Street_Ranga.mp3",
  "sun%20ra%20india%20cover_oli.mp3",
  "Swing.mp3",
  "take%20it%20sleazy.mp3",
  "tavener's%20caddy.mp3",
  "TCRL17_oli.mp3",
  "terry%20oldfeild_ranga.mp3",
  "The%20Mask_Ol.mp3",
  "the%20roof%20we%20live%20under.mp3",
  "the%20sweat%20%28remix%29.mp3",
  "the%20worst%20yet_ranga%20%5Bunmastered%5D%20.mp3",
  "the%20worst%20yet_ranga.mp3",
  "thmp_ranga.mp3",
  "tinky%20forest_ranga.mp3",
  "tompo%20house.mp3",
  "Tom's%20Funk%20-%20Ranga%202016%20.mp3",
  "turing_ol'%20%281%29.mp3",
  "turing_ol'.mp3",
  "u%20aint%20no%20jazz%20bruv_ranga%28mstr1%29.mp3",
  "U%20Broke%20My%20Yo_Ranga.mp3",
  "uaintnojazzbruv2018.mp3",
  "Untitled1_Ranga.mp3",
  "Untitled2_Ranga.mp3",
  "uplifting%20shit.mp3",
  "Wake%202.mp3",
  "what%20am%20i%20doing%20with%20my%20time%20PART%201.mp3",
  "what%20am%20i%20doing%20with%20my%20time%20PART%202.mp3",
  "what%20am%20i%20doing%20with%20my%20time%20PART%203.mp3",
  "whenever%20you%20feel%20alone.mp3",
  "White%20Peony_Ranga.mp3",
  "Whomper.mp3",
  "wiff%20waff%20master%202.mp3",
  "wittington%20you%20dick.mp3",
  "wittington%20you%20dick2.mp3",
  "Workout%201_Ranga.mp3",
  "Wyrt.mp3",
  "Yalways%20take%20my%20blues%20away%20_Ranga.mp3",
  "yam%20yam.mp3",
  "Zinabu_Ranga.mp3",
]

// Audio player hook - optimized for mobile
function useAudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const indices = Array.from({ length: TRACK_LIST.length }, (_, i) => i)
    const shuffled = [...indices].sort(() => Math.random() - 0.5)
    setShuffledIndices(shuffled)
  }, [])

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.crossOrigin = "anonymous"

    // Mobile optimizations
    if (isMobile) {
      audioRef.current.preload = "none" // Don't preload on mobile
      audioRef.current.volume = 0.8 // Slightly lower volume
    }

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % shuffledIndices.length)
      if (audioRef.current) {
        setTimeout(() => {
          audioRef.current?.play().catch(() => {
            setCurrentTrackIndex((prev) => (prev + 1) % shuffledIndices.length)
          })
        }, 100)
      }
    }

    const handleError = (e) => {
      console.log("Audio error, skipping:", e)
      setCurrentTrackIndex((prev) => (prev + 1) % shuffledIndices.length)
    }

    audioRef.current.addEventListener("ended", handleEnded)
    audioRef.current.addEventListener("error", handleError)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded)
        audioRef.current.removeEventListener("error", handleError)
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isMobile, shuffledIndices.length])

  useEffect(() => {
    if (audioRef.current && shuffledIndices.length > 0) {
      const actualIndex = shuffledIndices[currentTrackIndex]
      const trackName = TRACK_LIST[actualIndex]
      audioRef.current.src = `https://rangatracks.b-cdn.net/${trackName}`
    }
  }, [currentTrackIndex, shuffledIndices])

  const togglePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.log("Play failed:", error)
          skipToNext()
        })
    }
  }

  const skipToNext = () => {
    if (shuffledIndices.length === 0) return
    setCurrentTrackIndex((prev) => (prev + 1) % shuffledIndices.length)
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(() => {
          setCurrentTrackIndex((prev) => (prev + 1) % shuffledIndices.length)
        })
      }, 100)
    }
  }

  const getCurrentTrackName = () => {
    if (shuffledIndices.length === 0) return ""
    const actualIndex = shuffledIndices[currentTrackIndex]
    return (
      TRACK_LIST[actualIndex]
        ?.replace(/%20/g, " ")
        .replace(/%27/g, "'")
        .replace(/%28/g, "(")
        .replace(/%29/g, ")")
        .replace(/%26/g, "&") || ""
    )
  }

  return { isPlaying, togglePlayPause, skipToNext, audioElement: audioRef.current, getCurrentTrackName }
}

// Audio analysis hook - simplified for mobile
function useAudioAnalysis(audioElement: HTMLAudioElement | null) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [audioData, setAudioData] = useState({ volume: 0, bassLevel: 0, midLevel: 0, trebleLevel: 0 })
  const sourceRef = useRef<MediaElementSourceNode | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useIsMobile()
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(isMobile)

  const startListening = async () => {
    try {
      if (audioElement && audioElement.src) {
        if (!audioContext) {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)()

          if (context.state === "suspended") {
            await context.resume()
          }

          const source = context.createMediaElementSource(audioElement)
          const analyserNode = context.createAnalyser()

          // Reduce quality on mobile for better performance
          analyserNode.fftSize = isMobile ? 512 : 2048
          analyserNode.smoothingTimeConstant = 0.8

          source.connect(analyserNode)
          analyserNode.connect(context.destination)

          sourceRef.current = source
          setAudioContext(context)
          setAnalyser(analyserNode)
        }

        setIsListening(true)
      }
    } catch (error) {
      console.error("Error accessing audio:", error)
    }
  }

  const stopListening = () => {
    setIsListening(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (!analyser || !audioContext || !isListening) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const freqArray = new Float32Array(bufferLength)

    const analyze = () => {
      if (audioContext.state !== "running") return

      analyser.getByteTimeDomainData(dataArray)

      // Super simplified analysis for low performance mode
      if (isLowPerformanceMode) {
        let sum = 0
        for (let i = 0; i < Math.min(bufferLength, 256); i++) {
          // Process fewer samples
          const sample = (dataArray[i] - 128) / 128
          sum += sample * sample
        }
        const volume = Math.sqrt(sum / Math.min(bufferLength, 256))

        setAudioData({
          volume: Math.min(1, volume * 5),
          bassLevel: volume * 0.5,
          midLevel: volume * 0.5,
          trebleLevel: volume * 0.5,
        })
        return
      }

      analyser.getFloatFrequencyData(freqArray)

      // Calculate volume (RMS)
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        const sample = (dataArray[i] - 128) / 128
        sum += sample * sample
      }
      const volume = Math.sqrt(sum / bufferLength)

      // Simplified frequency analysis for mobile
      const bassEnd = Math.floor((200 * bufferLength) / (audioContext.sampleRate / 2))
      const midEnd = Math.floor((2000 * bufferLength) / (audioContext.sampleRate / 2))

      let bassSum = 0,
        midSum = 0,
        trebleSum = 0
      let bassCount = 0,
        midCount = 0,
        trebleCount = 0

      for (let i = 1; i < bassEnd; i++) {
        if (freqArray[i] > Number.NEGATIVE_INFINITY) {
          bassSum += Math.pow(10, freqArray[i] / 20)
          bassCount++
        }
      }

      for (let i = bassEnd; i < midEnd; i++) {
        if (freqArray[i] > Number.NEGATIVE_INFINITY) {
          midSum += Math.pow(10, freqArray[i] / 20)
          midCount++
        }
      }

      for (let i = midEnd; i < freqArray.length; i++) {
        if (freqArray[i] > Number.NEGATIVE_INFINITY) {
          trebleSum += Math.pow(10, freqArray[i] / 20)
          trebleCount++
        }
      }

      const bassLevel = bassCount > 0 ? bassSum / bassCount : 0
      const midLevel = midCount > 0 ? midSum / midCount : 0
      const trebleLevel = trebleCount > 0 ? trebleSum / trebleCount : 0

      setAudioData({
        volume: Math.min(1, volume * 10),
        bassLevel: Math.min(1, bassLevel * 100),
        midLevel: Math.min(1, midLevel * 100),
        trebleLevel: Math.min(1, trebleLevel * 100),
      })
    }

    // Slower analysis on mobile to reduce CPU load
    const interval = isMobile ? 100 : 50
    intervalRef.current = setInterval(analyze, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [analyser, audioContext, isListening, isMobile, isLowPerformanceMode])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  return { audioData, isListening, startListening, stopListening, isLowPerformanceMode, setIsLowPerformanceMode }
}

// Loading Progress Component
function LoadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 3
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="text-white text-xl luminari bg-black/80 px-6 py-4 rounded-lg border border-gray-600">
        <div className="text-center mb-4">Loading Ranga...</div>
        <div className="w-64 bg-gray-700 rounded-full h-2 mb-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-300 text-center">{Math.round(progress)}%</div>
        <div className="text-xs text-gray-400 text-center mt-2">
          {progress < 30 && "Awakening from stone..."}
          {progress >= 30 && progress < 60 && "Loading ancient geometry..."}
          {progress >= 60 && progress < 90 && "Preparing the cave..."}
          {progress >= 90 && "Almost ready..."}
        </div>
      </div>
    </div>
  )
}

// Animated Gradient Background Component - optimized for mobile
function DynamicBackground({ showStars, isMobile }: { showStars: boolean; isMobile: boolean }) {
  const starsRef = useRef<any>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const { scene } = useThree()

  const zenColors = [
    [0.9, 0.8, 0.9],
    [0.8, 0.9, 0.95],
    [0.9, 95, 0.8],
    [0.95, 0.9, 0.8],
    [0.9, 0.85, 0.95],
    [0.85, 0.95, 0.9],
    [0.95, 0.9, 0.85],
    [0.8, 0.9, 0.85],
  ]

  const gradientMaterial = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Vector3(...zenColors[0]) },
        color2: { value: new THREE.Vector3(...zenColors[1]) },
        color3: { value: new THREE.Vector3(...zenColors[2]) },
        color4: { value: new THREE.Vector3(...zenColors[3]) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          
          float wave1 = sin(uv.x * 3.0 + time * 0.5) * 0.5 + 0.5;
          float wave2 = cos(uv.y * 2.0 + time * 0.3) * 0.5 + 0.5;
          float wave3 = sin((uv.x + uv.y) * 2.5 + time * 0.4) * 0.5 + 0.5;
          
          vec3 color = mix(color1, color2, wave1);
          color = mix(color, color3, wave2);
          color = mix(color, color4, wave3);
          
          float movement = sin(time * 0.2 + uv.x * 4.0) * cos(time * 0.15 + uv.y * 3.0);
          color += movement * 0.05;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
    }),
  )

  useFrame((state, delta) => {
    if (showStars) {
      gradientMaterial.current.uniforms.time.value = state.clock.elapsedTime

      const colorIndex = Math.floor(state.clock.elapsedTime * 0.1) % zenColors.length
      const nextColorIndex = (colorIndex + 1) % zenColors.length
      const lerpFactor = (state.clock.elapsedTime * 0.1) % 1

      const currentColor1 = zenColors[colorIndex]
      const nextColor1 = zenColors[nextColorIndex]
      const currentColor2 = zenColors[(colorIndex + 2) % zenColors.length]
      const nextColor2 = zenColors[(colorIndex + 3) % zenColors.length]

      gradientMaterial.current.uniforms.color1.value.lerpVectors(
        new THREE.Vector3(...currentColor1),
        new THREE.Vector3(...nextColor1),
        lerpFactor,
      )
      gradientMaterial.current.uniforms.color2.value.lerpVectors(
        new THREE.Vector3(...currentColor2),
        new THREE.Vector3(...nextColor2),
        lerpFactor,
      )

      if (!meshRef.current) {
        // Reduce geometry complexity on mobile
        const segments = isMobile ? 16 : 32
        const geometry = new THREE.SphereGeometry(500, segments, segments)
        meshRef.current = new THREE.Mesh(geometry, gradientMaterial.current)
        scene.add(meshRef.current)
      }
      scene.background = null

      if (starsRef.current) {
        const time = state.clock.elapsedTime
        starsRef.current.rotation.x = Math.sin(time * 0.02) * 0.1
        starsRef.current.rotation.y = time * 0.005
        starsRef.current.rotation.z = Math.cos(time * 0.015) * 0.05

        const avgColor1 = gradientMaterial.current.uniforms.color1.value
        const avgColor2 = gradientMaterial.current.uniforms.color2.value
        const avgR = (avgColor1.x + avgColor2.x) / 2
        const avgG = (avgColor1.y + avgColor2.y) / 2
        const avgB = (avgColor1.z + avgColor2.z) / 2

        const invertedColor = new THREE.Color(1 - avgR, 1 - avgG, 1 - avgB)

        if (starsRef.current.material) {
          starsRef.current.material.color = invertedColor
        }
      }
    } else {
      if (meshRef.current) {
        scene.remove(meshRef.current)
        meshRef.current = null
      }
      scene.background = new THREE.Color("#000000")
    }
  })

  return (
    <>
      {showStars && (
        <group ref={starsRef}>
          {/* Reduce star count on mobile */}
          <Stars radius={100} depth={50} count={isMobile ? 2000 : 8000} factor={6} saturation={1} fade speed={0.5} />
        </group>
      )}
    </>
  )
}

// Loading Camera Animation Component
function LoadingCameraAnimation({ onComplete }: { onComplete: () => void }) {
  const { camera } = useThree()
  const [isAnimating, setIsAnimating] = useState(true)
  const startTime = useRef<number | null>(null)
  const animationDuration = 3000

  useFrame((state) => {
    if (!isAnimating) return

    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime * 1000
    }

    const elapsed = state.clock.elapsedTime * 1000 - startTime.current
    const progress = Math.min(elapsed / animationDuration, 1)

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)
    const easedProgress = easeInOutCubic(progress)

    const startY = 15
    const startZ = 0
    const startX = 0
    const endY = 1.0
    const endZ = -0.7 + 6.1
    const endX = 1.2

    camera.position.y = startY + (endY - startY) * easedProgress
    camera.position.z = startZ + (endZ - startZ) * easedProgress
    camera.position.x = startX + (endX - startX) * easedProgress

    // Center Ranga better - adjusted target position
    camera.lookAt(-1.5, -0.2, -1.5)

    if (progress >= 1) {
      setIsAnimating(false)
      onComplete()
    }
  })

  return null
}

// Orbiting Light Component - simplified for mobile
function OrbitingLight({
  index,
  baseIntensity,
  audioMultiplier,
  audioData,
  isListening,
  targetPosition,
  shuKnob,
  phiKnob,
  thetaKnob,
  isMobile,
  isLowPerformanceMode,
}: {
  index: number
  baseIntensity: number
  audioMultiplier: number
  audioData: any
  isListening: boolean
  targetPosition: THREE.Vector3
  shuKnob: number
  phiKnob: number
  thetaKnob: number
  isMobile: boolean
  isLowPerformanceMode: boolean
}) {
  const lightRef = useRef<THREE.PointLight>(null)
  const sphereRef = useRef<THREE.Mesh>(null)

  const defaultColors = ["#8000ff", "#00ff00", "#ff8000"]
  const topSliderColors = ["#ff8000", "#ffff00", "#ff0000"]
  const colors = shuKnob > 0.1 ? topSliderColors : defaultColors
  const color = colors[index]

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Simplified movement on low performance mode
    if (isLowPerformanceMode) {
      const simpleX = targetPosition.x + Math.cos(time * 0.2 + index) * 1.5
      const simpleZ = targetPosition.z + Math.sin(time * 0.2 + index) * 1.5
      const simpleY = targetPosition.y + 0.5

      if (lightRef.current) {
        lightRef.current.position.set(simpleX, simpleY, simpleZ)
        lightRef.current.intensity = baseIntensity * 0.5 // Lower intensity
        lightRef.current.color.setHex(Number.parseInt(color.replace("#", "0x")))
      }
      if (sphereRef.current) {
        sphereRef.current.position.set(simpleX, simpleY, simpleZ)
      }
      return
    }

    const baseRadius = 2.5 - phiKnob * 1.0
    const radius = baseRadius + Math.sin(time * 0.5) * 0.5

    const baseSpeed = 0.5 + index * 0.2
    const speed = baseSpeed

    const angleOffset = (index * Math.PI * 2) / 3
    const angle = time * speed + angleOffset

    const orbitX = targetPosition.x + Math.cos(angle) * radius
    const orbitZ = targetPosition.z + Math.sin(angle) * radius
    const orbitY = targetPosition.y + Math.sin(time * 0.3 + index) * 1.5 + Math.cos(angle * 0.5) * 0.8

    const position = new THREE.Vector3(orbitX, orbitY, orbitZ)

    if (lightRef.current) {
      lightRef.current.position.copy(position)
      // Reduce intensity on mobile to improve performance
      const intensity = (baseIntensity + (isListening ? audioData.volume * audioMultiplier : 0)) * (isMobile ? 0.7 : 1)
      lightRef.current.intensity = intensity
      lightRef.current.color.setHex(Number.parseInt(color.replace("#", "0x")))
    }
    if (sphereRef.current) {
      sphereRef.current.position.copy(position)
      const material = sphereRef.current.material as THREE.MeshBasicMaterial
      material.color.setHex(Number.parseInt(color.replace("#", "0x")))
    }
  })

  return (
    <>
      <pointLight ref={lightRef} color={color} intensity={baseIntensity} distance={8} decay={2} />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  )
}

// Click Handler Component
function ClickHandler({
  onPositionLock,
  isLocked,
}: {
  onPositionLock: (position: THREE.Vector3) => void
  isLocked: boolean
}) {
  const { camera, size } = useThree()

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('.ui-card, .ui-button, .ui-slider, [role="slider"]')) {
        return
      }

      const x = (event.clientX / size.width) * 2 - 1
      const y = -(event.clientY / size.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

      const distance = 6
      const worldPosition = raycaster.ray.origin.clone().add(raycaster.ray.direction.multiplyScalar(distance))

      onPositionLock(worldPosition)
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [camera, size, onPositionLock])

  return null
}

// Mouse Tracker Component
function MouseTracker({
  onMouseMove,
  isActive,
}: {
  onMouseMove: (position: THREE.Vector3) => void
  isActive: boolean
}) {
  const { camera, size } = useThree()

  useEffect(() => {
    if (!isActive) return

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / size.width) * 2 - 1
      const y = -(event.clientY / size.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

      const distance = 6
      const worldPosition = raycaster.ray.origin.clone().add(raycaster.ray.direction.multiplyScalar(distance))

      onMouseMove(worldPosition)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [camera, size, onMouseMove, isActive])

  return null
}

// Main Ranga Model Component - optimized for mobile
function RangaStoneModel({
  audioData,
  morphingEffect,
  bulgeEffect,
  noiseDistortion,
  waveDistortion,
  rangaLightEmission,
  statueX,
  statueY,
  statueZ,
  lightPositions,
  shuKnob,
  onModelLoaded,
  isMobile,
  isLowPerformanceMode,
}: {
  audioData: any
  morphingEffect: number
  bulgeEffect: number
  noiseDistortion: number
  waveDistortion: number
  rangaLightEmission: number
  statueX: number
  statueY: number
  statueZ: number
  lightPositions: THREE.Vector3[]
  shuKnob: number
  onModelLoaded: () => void
  isMobile: boolean
  isLowPerformanceMode: boolean
}) {
  const statueRef = useRef<any>(null)
  const originalPositionsRef = useRef<Float32Array | null>(null)
  const rangaLightRef = useRef<THREE.PointLight>(null)
  const [modelLoaded, setModelLoaded] = useState(false)

  const { scene } = useGLTF(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ranga%20to%20stone-m7YvIesppuKQRTa3UVqUlhH3glJq23.glb",
  )
  const texture = useLoader(THREE.TextureLoader, "/textures/stone-texture.png")

  useEffect(() => {
    if (scene && texture && !modelLoaded) {
      console.log("Model loaded successfully")
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2, 2)

      scene.traverse((child) => {
        if (child.type === "Mesh") {
          statueRef.current = child
          const mesh = child as any
          mesh.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.8,
            metalness: 0.1,
          })
          if (mesh.geometry?.attributes.position) {
            originalPositionsRef.current = new Float32Array(mesh.geometry.attributes.position.array)
          }
        }
      })

      setModelLoaded(true)
      onModelLoaded()
    }
  }, [scene, texture, modelLoaded, onModelLoaded])

  useFrame((state) => {
    if (!statueRef.current || !originalPositionsRef.current) return
    const time = state.clock.elapsedTime
    const mesh = statueRef.current
    const positions = mesh.geometry.attributes.position.array as Float32Array
    const originalPositions = originalPositionsRef.current

    if (rangaLightRef.current) {
      const glowIntensity = (1 + shuKnob * 2) * (isMobile ? 0.3 : 1) // Much lower on mobile
      rangaLightRef.current.intensity = glowIntensity
      rangaLightRef.current.position.set(statueX, statueY + 1, statueZ)
    }

    // Remove this block:
    // Skip expensive vertex manipulation in low performance mode to prioritize music performance
    // if (isLowPerformanceMode) {
    //   return
    // }

    // Reduce effect intensity on mobile for better performance
    const mobileMultiplier = isMobile ? 0.5 : 1
    const bassReactive = Math.max(0, audioData.bassLevel * 50 * mobileMultiplier)
    const midReactive = Math.max(0, audioData.midLevel * 50 * mobileMultiplier)
    const trebleReactive = Math.max(0, audioData.trebleLevel * 50 * mobileMultiplier)
    const volumeReactive = Math.max(0, audioData.volume * 100 * mobileMultiplier)

    const timeBasedMovement = Math.sin(time * 0.5) * 0.1 * mobileMultiplier

    for (let i = 0; i < positions.length; i += 3) {
      const vertexPos = new THREE.Vector3(
        originalPositions[i] * 0.014 + statueX,
        originalPositions[i + 1] * 0.014 + statueY - 1,
        originalPositions[i + 2] * 0.014 + statueZ,
      )
      const displacement = new THREE.Vector3(0, 0, 0)

      // Light-based distortion
      lightPositions.forEach((lightPos) => {
        const dist = vertexPos.distanceTo(lightPos)
        const influence = Math.max(0, 1 - dist / 3) * rangaLightEmission
        if (influence > 0) {
          const displacementDir = new THREE.Vector3().subVectors(vertexPos, lightPos).normalize()
          const lightMorphingMultiplier = (1.0 + (shuKnob / 4) * 2.0) * mobileMultiplier
          displacement.add(displacementDir.multiplyScalar(influence * lightMorphingMultiplier))
        }
      })

      // Morphing effect
      if (morphingEffect > 0) {
        const morphPhase = Math.sin(time * 0.5 + (vertexPos.x + vertexPos.y + vertexPos.z) * 2)
        const morphDirection = new THREE.Vector3(
          Math.sin(time * 0.3 + vertexPos.y * 5),
          Math.cos(time * 0.4 + vertexPos.x * 5),
          Math.sin(time * 0.2 + vertexPos.z * 5),
        ).normalize()
        const morphIntensity =
          (bassReactive + midReactive + trebleReactive + timeBasedMovement + 1) * morphingEffect * morphPhase * 0.5
        displacement.add(morphDirection.multiplyScalar(morphIntensity))
      }

      // Bulge effect
      if (bulgeEffect > 0) {
        const distance = new THREE.Vector3(vertexPos.x - statueX, vertexPos.y - statueY, vertexPos.z - statueZ).length()
        const bulge = Math.exp(-distance * 2.0) * bulgeEffect * (volumeReactive + timeBasedMovement + 1) * 1.0
        const direction = new THREE.Vector3(
          originalPositions[i],
          originalPositions[i + 1],
          originalPositions[i + 2],
        ).normalize()
        displacement.add(direction.multiplyScalar(bulge))
      }

      // Noise distortion
      if (noiseDistortion > 0) {
        const randomNoise = (Math.random() - 0.5) * 0.3
        const structuredNoise = Math.sin(vertexPos.x * 10 + time * 2) * Math.cos(vertexPos.y * 8 + time * 1.5) * 0.4
        const combinedNoise =
          (randomNoise + structuredNoise) * noiseDistortion * (midReactive + timeBasedMovement + 1) * 0.8

        displacement.add(new THREE.Vector3(combinedNoise, combinedNoise * 0.7, combinedNoise * 0.9))
      }

      // Wave distortion
      if (waveDistortion > 0) {
        const wave =
          Math.sin((vertexPos.x - statueX) * 5 + time * 3) *
          waveDistortion *
          (trebleReactive + timeBasedMovement + 1) *
          1.0
        displacement.y += wave
      }

      positions[i] = originalPositions[i] + displacement.x
      positions[i + 1] = originalPositions[i + 1] + displacement.y
      positions[i + 2] = originalPositions[i + 2] + displacement.z
    }
    mesh.geometry.attributes.position.needsUpdate = true
    mesh.geometry.computeVertexNormals()
  })

  return (
    <group
      position={[statueX, statueY, statueZ]}
      rotation={[0, (304 * Math.PI) / 180, 0]}
      scale={[0.014, 0.014, 0.014]}
    >
      <primitive object={scene} />
      <pointLight ref={rangaLightRef} color="#ffffff" intensity={1} distance={10} decay={1} position={[0, 50, 0]} />
      <pointLight position={[0, 100, 0]} color="#FFA500" intensity={0.5} distance={200} decay={1} />
    </group>
  )
}

export default function Page() {
  const isMobile = useIsMobile()
  const audioPlayer = useAudioPlayer()
  const { audioData, isListening, startListening, stopListening, isLowPerformanceMode, setIsLowPerformanceMode } =
    useAudioAnalysis(audioPlayer.audioElement)

  // Position states - centered Ranga better
  const [statueX] = useState(-2.2) // Move further left to center better
  const [statueY] = useState(-0.2)
  const [statueZ] = useState(-1.5)
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  // Light position tracking
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3(statueX, statueY, statueZ))
  const [lockedPosition, setLockedPosition] = useState<THREE.Vector3 | null>(null)
  const [isPositionLocked, setIsPositionLocked] = useState(false)

  // Control states
  const [shuKnob, setShuKnob] = useState(0.0)
  const [phiKnob, setPhiKnob] = useState(0.0)
  const [thetaKnob, setThetaKnob] = useState(0.0)
  const [showStars, setShowStars] = useState(false)

  // UI states
  const [showHelp, setShowHelp] = useState(false)
  const [isControlsMinimized, setIsControlsMinimized] = useState(false)
  const [isLowPerformanceModeLocal, setIsLowPerformanceModeLocal] = useState(isMobile) // Default to low performance on mobile

  // Calculate derived values
  const rangaLightEmission = (shuKnob / 4) * 2
  const baseIntensity = (shuKnob / 4) * 3.5 + 0.5
  const audioMultiplier = (shuKnob / 4) * 1.5 + 0.5
  const noiseDistortion = phiKnob * 2.5
  const waveDistortion = phiKnob * 2.5
  const morphingEffect = thetaKnob

  const getThetaColor = (value: number) => {
    const normalizedValue = value / 5
    const red = Math.floor(normalizedValue * 128)
    const green = Math.floor(255 - normalizedValue * 255)
    const blue = Math.floor(normalizedValue * 255)
    return `rgb(${red}, ${green}, ${blue})`
  }

  const handlePositionLock = (position: THREE.Vector3) => {
    if (isPositionLocked) {
      setIsPositionLocked(false)
      setLockedPosition(null)
    } else {
      setIsPositionLocked(true)
      setLockedPosition(position.clone())
    }
  }

  const targetPosition = isPositionLocked && lockedPosition ? lockedPosition : mousePosition

  // Help Modal Component
  const HelpModal = () =>
    showHelp && (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <Card className="bg-black/95 text-white border-gray-600 max-w-2xl max-h-[80vh] overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold luminari">Ranga's Story</h2>
              <Button
                onClick={() => setShowHelp(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] pr-2 text-sm leading-relaxed space-y-4">
              <p>Yo!</p>
              <p>
                Thanks for being here in Ranga's cave. You might have one of these statues, but do you know the whole
                story?
              </p>
              <p>
                Long ago, in the cave inside the earth, Ranga banged and banged and banged. He loved to drum, and
                drummed on everything around everyone. He travelled around the kingdom he called Argara, until he found
                Shuk, a mountain that rose high up towards the central floating core in the inside of the earth. Inside
                Shuk is a magical infinite cave, the cave is known for having the most interesting echo effect.
              </p>
              <p>
                The echoes would become alive and dance in the cave, they would take forms and find rocks to bang, the
                echoes created shadows who grew winds and sparks that created harps, gongs, fubarbettes and any
                instrument he could imagine. Ranga loved this cave, and he spent many years alone here banging and
                banging and banging with his own echoes, the music you can hear here.
              </p>
              <p>
                As this went on Shuk, the mountain Ranga lived inside began to dance. Shuk is one of the biggest
                mountains of Argara, and their dancing caused so much fuss. All kinds of muck, dust and smoke covered
                stone city, and the dust was laying thick on crystal city; so Argara decided to do something about it.
              </p>
              <p>
                Argara sent out an ask for help, they asked for someone to stop Ranga. So came the witch and sage, Nana
                & Azar. They travelled together, and entered Ranga's cave.
              </p>
              <p>
                Azar went first, but as soon as he heard the music he couldn't help but to dance and play. He drummed as
                well and piped upon his flute, he grew into a cluster of red balloons on the roof and flew away each
                time he came close to Ranga's way.
              </p>
              <p>
                So Nana kept it simple, and in a poof of smoke, arrived behind Ranga singing her own song. She clicked
                her fingers and in an instant, Ranga was turned to stone.
              </p>
              <p>"Slippy slop this smock, he can for now live as a rock" Nana cackled.</p>
              <p>to which Azar added a twist to the spell.</p>
              <p>"Until we need the music for the change of days"</p>
              <p>--</p>
              <p>
                So here, for you is Ranga, You can play with the sliders, the buttons and listen through 24 hours of his
                earliest music. Ranga is ultimately Oli, if you would like to check out Ranga's music and see what he's
                up to these days you can follow this linktree :)
              </p>
              <p>
                <a
                  href="https://linktr.ee/olranga"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  https://linktr.ee/olranga
                </a>
              </p>
              <p>Thanks again!</p>
              {isMobile && (
                <div className="mt-4 p-3 bg-yellow-900/30 rounded border border-yellow-600">
                  <p className="text-yellow-200 text-xs">
                    <strong>Mobile Tip:</strong> For the best audio experience, try using headphones and ensure your
                    device has good performance. Some effects are reduced on mobile for better performance.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )

  return (
    <div className="w-full h-screen bg-black">
      {(!isLoadingComplete || !modelLoaded) && <LoadingProgress />}

      {/* Music Player */}
      <Card className="absolute bottom-4 right-4 z-10 bg-black/80 border-gray-600 ui-card">
        <CardContent className="p-3">
          <div className="flex gap-2 mb-2">
            <Button
              onClick={audioPlayer.togglePlayPause}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800 p-2 luminari ui-button"
            >
              {audioPlayer.isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button
              onClick={audioPlayer.skipToNext}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800 p-2 luminari ui-button"
            >
              <SkipForward size={16} />
            </Button>
          </div>
          <div className="text-xs text-gray-300 max-w-48 truncate luminari">{audioPlayer.getCurrentTrackName()}</div>
          {isMobile && <div className="text-xs text-yellow-400 mt-1">Mobile Mode</div>}
        </CardContent>
      </Card>

      {/* Help Button */}
      <Button
        onClick={() => setShowHelp(!showHelp)}
        size="sm"
        className={`absolute top-4 left-4 z-10 luminari ui-button ${
          showHelp
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-black text-white border-white hover:bg-gray-800"
        }`}
      >
        ?
      </Button>

      {/* Control Panel with Minimize Function */}
      <Card
        className={`absolute top-4 right-4 z-10 bg-black/90 text-white border-gray-600 transition-all duration-300 ui-card ${
          isControlsMinimized ? "max-w-16" : "max-w-xs"
        }`}
      >
        <CardContent className="p-4">
          {/* Minimize/Maximize Button */}
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => setIsControlsMinimized(!isControlsMinimized)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800 p-1 ui-button"
            >
              {isControlsMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </Button>
          </div>

          {!isControlsMinimized && (
            <div className="space-y-4">
              {/* Stars Button */}
              <Button
                onClick={() => setShowStars(!showStars)}
                size="sm"
                className={`w-full luminari ui-button ${
                  showStars
                    ? "bg-black text-white border-white hover:bg-gray-900"
                    : "bg-black text-black border-black hover:bg-gray-800"
                }`}
              >
                ʂжu
              </Button>

              {/* Audio Analysis Button */}
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                size="sm"
                className="w-full luminari ui-button"
              >
                iΘ þн
              </Button>

              {/* Performance Mode Toggle - only show on mobile */}
              {isMobile && (
                <Button
                  onClick={() => setIsLowPerformanceMode(!isLowPerformanceMode)}
                  size="sm"
                  className={`w-full luminari ui-button ${
                    isLowPerformanceMode
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isLowPerformanceMode ? "Low Quality" : "High Quality"}
                </Button>
              )}

              {/* 术 Knob */}
              <div className="space-y-2">
                <label className="text-sm font-bold luminari text-yellow-400">术</label>
                <Slider
                  value={[shuKnob]}
                  onValueChange={([v]) => setShuKnob(v)}
                  min={0}
                  max={4}
                  step={0.1}
                  className="ui-slider"
                />
              </div>

              {/* ф Knob */}
              <div className="space-y-2">
                <label className="text-sm font-bold luminari text-white">ф</label>
                <Slider
                  value={[phiKnob]}
                  onValueChange={([v]) => setPhiKnob(v)}
                  min={0}
                  max={2}
                  step={0.1}
                  className="ui-slider"
                />
              </div>

              {/* Θ Knob */}
              <div className="space-y-2">
                <label className="text-sm font-bold luminari" style={{ color: getThetaColor(thetaKnob) }}>
                  Θ
                </label>
                <Slider
                  value={[thetaKnob]}
                  onValueChange={([v]) => setThetaKnob(v)}
                  min={0}
                  max={5}
                  step={0.1}
                  className="ui-slider"
                />
              </div>

              {/* Position Lock Status */}
              {isPositionLocked && <div className="text-xs text-yellow-400 luminari">sor</div>}
            </div>
          )}
        </CardContent>
      </Card>

      <Canvas camera={{ position: [0, 15, 0], fov: 75 }}>
        <DynamicBackground showStars={showStars} isMobile={isMobile} />
        {!isLoadingComplete && <LoadingCameraAnimation onComplete={() => setIsLoadingComplete(true)} />}
        <ambientLight intensity={0.1} />

        <ClickHandler onPositionLock={handlePositionLock} isLocked={isPositionLocked} />
        <MouseTracker onMouseMove={setMousePosition} isActive={!isPositionLocked} />

        {/* Orbiting Lights - fewer in low performance mode */}
        {(isLowPerformanceMode ? [0] : [0, 1, 2]).map((index) => (
          <OrbitingLight
            key={index}
            index={index}
            baseIntensity={baseIntensity}
            audioMultiplier={audioMultiplier}
            audioData={audioData}
            isListening={isListening}
            targetPosition={targetPosition}
            shuKnob={shuKnob}
            phiKnob={phiKnob}
            thetaKnob={thetaKnob}
            isMobile={isMobile}
            isLowPerformanceMode={isLowPerformanceMode}
          />
        ))}

        <Suspense fallback={null}>
          <RangaStoneModel
            audioData={audioData}
            morphingEffect={morphingEffect}
            bulgeEffect={1.0}
            noiseDistortion={noiseDistortion}
            waveDistortion={waveDistortion}
            rangaLightEmission={rangaLightEmission}
            statueX={statueX}
            statueY={statueY}
            statueZ={statueZ}
            lightPositions={[targetPosition, targetPosition, targetPosition]}
            shuKnob={shuKnob}
            onModelLoaded={() => setModelLoaded(true)}
            isMobile={isMobile}
            isLowPerformanceMode={isLowPerformanceMode}
          />
        </Suspense>

        <OrbitControls
          enableDamping
          enableZoom={isLoadingComplete}
          enablePan={isLoadingComplete}
          enableRotate={isLoadingComplete}
          target={[statueX, statueY, statueZ]}
        />
      </Canvas>

      <HelpModal />

      {isLowPerformanceMode && (
        <Card className="absolute top-16 left-4 z-10 bg-green-900/80 border-green-600 ui-card max-w-xs">
          <CardContent className="p-2">
            <div className="text-xs text-green-200 luminari">
              Low Quality Mode: Visual effects reduced for optimal music performance
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
