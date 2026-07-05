import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePrescriptionStore = create(
  persist(
    (set) => ({
      currentPrescription: null,
      uploadProgress: 0,
      ocrState: 'idle', // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
      aiResult: null,
      history: [], // Stores user-added or local references

      setCurrentPrescription: (currentPrescription) => set({ currentPrescription }),
      setUploadProgress: (uploadProgress) => set({ uploadProgress }),
      setOcrState: (ocrState) => set({ ocrState }),
      setAiResult: (aiResult) => set({ aiResult }),
      addHistoryEntry: (entry) => set((state) => ({ history: [entry, ...state.history] })),
      
      clearPrescription: () => set({ currentPrescription: null, uploadProgress: 0, ocrState: 'idle' }),
      clearAiResult: () => set({ aiResult: null }),
      
      resetStore: () => set({
        currentPrescription: null,
        uploadProgress: 0,
        ocrState: 'idle',
        aiResult: null
      })
    }),
    {
      name: 'rxease-prescription-storage',
      partialize: (state) => ({
        history: state.history
      }),
    }
  )
);

export default usePrescriptionStore;
