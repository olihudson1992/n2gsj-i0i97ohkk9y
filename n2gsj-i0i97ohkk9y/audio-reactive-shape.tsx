"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Audio analysis hook
function useAudioAnalysis() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [audioData, setAudioData] = useState({
    pitch: 0,
    volume: 0,
    note: "A#",
    sustainedVolume: 0,
  })

  const sustainedVolumeRef = useRef(0)
  const volumeDecayRef = useRef(0)

  // A# major scale frequencies (A# = 466.16 Hz as root)
  const scaleFrequencies = {
    "A#": 466.16,
    C: 523.25,
    D: 587.33,
    "D#": 622.25,
    F: 698.46,
    G: 783.99,
    A: 880.0,
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const context = new AudioContext()
      const source = context.createMediaStreamSource(stream)
      const analyserNode = context.createAnalyser()

      analyserNode.fftSize = 2048
      source.connect(analyserNode)

      setAudioContext(context)
      setAnalyser(analyserNode)
      setIsListening(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopListening = () => {
    if (audioContext) {
      audioContext.close()
    }
    setIsListening(false)
    setAudioContext(null)
    setAnalyser(null)
  }

  useEffect(() => {
    if (!analyser) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const freqArray = new Float32Array(bufferLength)

    const analyze = () => {
      analyser.getByteTimeDomainData(dataArray)
      analyser.getFloatFrequencyData(freqArray)

      // Calculate volume (RMS)
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        const sample = (dataArray[i] - 128) / 128
        sum += sample * sample
      }
      const volume = Math.sqrt(sum / bufferLength)

      // Update sustained volume with gradual decay
      if (volume > sustainedVolumeRef.current) {
        sustainedVolumeRef.current = volume
        volumeDecayRef.current = 0
      } else {
        volumeDecayRef.current += 0.02
        sustainedVolumeRef.current = Math.max(0, sustainedVolumeRef.current - volumeDecayRef.current)
      }

      // Find dominant frequency
      let maxIndex = 0
      let maxValue = Number.NEGATIVE_INFINITY
      for (let i = 0; i < freqArray.length; i++) {
        if (freqArray[i] > maxValue) {
          maxValue = freqArray[i]
          maxIndex = i
        }
      }

      const frequency = (maxIndex * audioContext!.sampleRate) / (2 * bufferLength)

      // Find closest note in A# major scale
      let closestNote = "A#"
      let minDiff = Number.POSITIVE_INFINITY
      Object.entries(scaleFrequencies).forEach(([note, freq]) => {
        const diff = Math.abs(frequency - freq)
        if (diff < minDiff) {
          minDiff = diff
          closestNote = note
        }
      })

      setAudioData({
        pitch: frequency,
        volume,
        note: closestNote,
        sustainedVolume: sustainedVolumeRef.current,
      })
    }

    const intervalId = setInterval(analyze, 50)
    return () => clearInterval(intervalId)
  }, [analyser, audioContext])

  return { audioData, isListening, startListening, stopListening }
}

// 3D Shape component
function ReactiveShape({ audioData }: { audioData: any }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mistRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Load texture
  const texture = useLoader(THREE.TextureLoader, "/textures/stone.png")

  // Color mapping for notes
  const noteColors = {
    "A#": new THREE.Color(0.7, 0.9, 1.0), // light blue
    F: new THREE.Color(1.0, 0.5, 0.0), // orange
    C: new THREE.Color(1.0, 1.0, 0.0), // yellow
    D: new THREE.Color(0.0, 1.0, 0.0), // green
    "D#": new THREE.Color(0.0, 0.0, 1.0), // blue
    G: new THREE.Color(1.0, 0.0, 0.0), // red
    A: new THREE.Color(0.5, 0.0, 1.0), // purple
  }

  // Create mist particles
  const mistGeometry = new THREE.BufferGeometry()
  const mistCount = 1000
  const positions = new Float32Array(mistCount * 3)
  const colors = new Float32Array(mistCount * 3)

  for (let i = 0; i < mistCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4

    colors[i * 3] = 1
    colors[i * 3 + 1] = 1
    colors[i * 3 + 2] = 1
  }

  mistGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  mistGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  useFrame((state) => {
    if (!meshRef.current || !mistRef.current || !groupRef.current) return

    const { volume, sustainedVolume, note, pitch } = audioData

    // Smooth width changes based on sustained volume
    const targetScale = 1 + sustainedVolume * 2
    const currentScale = meshRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05)

    meshRef.current.scale.set(newScale, 1, newScale)

    // Direction changes based on pitch
    const normalizedPitch = Math.max(0, Math.min(1, (pitch - 200) / 600))
    const targetY = (normalizedPitch - 0.5) * 2
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.02)

    // Update mist color based on note
    const targetColor = noteColors[note as keyof typeof noteColors] || noteColors["A#"]
    const mistColors = mistRef.current.geometry.attributes.color.array as Float32Array

    for (let i = 0; i < mistCount; i++) {
      mistColors[i * 3] = THREE.MathUtils.lerp(mistColors[i * 3], targetColor.r, 0.1)
      mistColors[i * 3 + 1] = THREE.MathUtils.lerp(mistColors[i * 3 + 1], targetColor.g, 0.1)
      mistColors[i * 3 + 2] = THREE.MathUtils.lerp(mistColors[i * 3 + 2], targetColor.b, 0.1)
    }
    mistRef.current.geometry.attributes.color.needsUpdate = true

    // Animate mist particles
    const mistPositions = mistRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < mistCount; i++) {
      mistPositions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.01
    }
    mistRef.current.geometry.attributes.position.needsUpdate = true

    // Gentle rotation
    meshRef.current.rotation.y += 0.005
  })

  return (
    <group ref={groupRef}>
      {/* Main shape */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Mist particles */}
      <points ref={mistRef}>
        <bufferGeometry attach="geometry" {...mistGeometry} />
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation />
      </points>
    </group>
  )
}

export default function AudioReactive3DShape() {
  const { audioData, isListening, startListening, stopListening } = useAudioAnalysis()

  return (
    <div className="w-full h-screen bg-black">
      <Card className="absolute top-4 left-4 z-10 bg-black/80 text-white border-gray-600">
        <CardHeader>
          <CardTitle>Audio Reactive 3D Shape</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
          >
            {isListening ? "Stop Listening" : "Start Microphone"}
          </Button>

          {isListening && (
            <div className="space-y-2 text-sm">
              <div>
                Note: <span className="font-bold">{audioData.note}</span>
              </div>
              <div>
                Pitch: <span className="font-mono">{audioData.pitch.toFixed(1)} Hz</span>
              </div>
              <div>
                Volume: <span className="font-mono">{(audioData.volume * 100).toFixed(1)}%</span>
              </div>
              <div>
                Sustained: <span className="font-mono">{(audioData.sustainedVolume * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ReactiveShape audioData={audioData} />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
