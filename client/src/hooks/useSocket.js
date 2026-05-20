import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useVideoStore } from '../store/videoStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || ''

export function useSocket(videoId) {
  const socketRef = useRef(null)
  const { updatePipelineStage, completeGeneration } = useVideoStore()

  useEffect(() => {
    if (!videoId) return

    socketRef.current = io(SOCKET_URL)
    const socket = socketRef.current

    socket.emit('join-video', videoId)

    socket.on('pipeline-update', (data) => {
      updatePipelineStage(data)
    })

    socket.on('generation-complete', (data) => {
      completeGeneration(data)
    })

    socket.on('generation-error', (data) => {
      console.error('Generation error:', data)
    })

    return () => {
      socket.disconnect()
    }
  }, [videoId])

  return socketRef.current
}
