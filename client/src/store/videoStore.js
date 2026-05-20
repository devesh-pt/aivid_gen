import { create } from 'zustand'

export const useVideoStore = create((set, get) => ({
  videos: [],
  currentVideo: null,
  generatingVideoId: null,
  pipelineStages: [],
  overallProgress: 0,
  isGenerating: false,

  setVideos: (videos) => set({ videos }),
  addVideo: (video) => set({ videos: [video, ...get().videos] }),
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setGenerating: (videoId) => set({ generatingVideoId: videoId, isGenerating: true, overallProgress: 0, pipelineStages: [] }),
  stopGenerating: () => set({ isGenerating: false, generatingVideoId: null }),
  
  updatePipelineStage: (update) => {
    const { pipelineStages } = get()
    const existingIdx = pipelineStages.findIndex(s => s.key === update.stage)
    const stageEntry = {
      key: update.stage,
      label: update.stageLabel,
      index: update.stageIndex,
      status: update.stageStatus,
      progress: update.stageProgress,
    }
    const newStages = existingIdx >= 0
      ? pipelineStages.map((s, i) => i === existingIdx ? stageEntry : s)
      : [...pipelineStages, stageEntry]
    set({ pipelineStages: newStages, overallProgress: update.overallProgress })
  },
  
  completeGeneration: (videoData) => set({
    currentVideo: videoData,
    isGenerating: false,
    overallProgress: 100,
  }),
}))
