import { create } from 'zustand';

export const usePrescriptionStore = create((set) => ({
  currentPrescription: null,
  uploadProgress: 0,
  ocrState: 'idle', // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  aiResult: null,

  setCurrentPrescription: (currentPrescription) => set({ currentPrescription }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setOcrState: (ocrState) => set({ ocrState }),
  setAiResult: (aiResult) => set({ aiResult }),
  
  clearPrescription: () => set({ currentPrescription: null, uploadProgress: 0, ocrState: 'idle' }),
  clearAiResult: () => set({ aiResult: null }),
  
  resetStore: () => set({
    currentPrescription: null,
    uploadProgress: 0,
    ocrState: 'idle',
    aiResult: null
  })
}));

export default usePrescriptionStore;
