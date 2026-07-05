import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePrescriptionStore = create(
  persist(
    (set) => ({
      currentPrescription: null,
      uploadProgress: 0,
      ocrState: 'idle', // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
      aiResult: null,
      history: [
        {
          id: 'h-1',
          doctor: 'Dr. Aris Thorne',
          department: 'General Hospital • Cardiology Dept',
          date: 'Oct 24, 2024',
          medicinesCount: 4,
          medicines: [
            { name: 'Amoxicillin', status: 'normal' },
            { name: 'Lisinopril', status: 'normal' },
            { name: 'Atorvastatin', status: 'normal' },
            { name: 'Metformin', status: 'normal' }
          ],
          ocrMatch: '99.2%',
          status: 'Verified', // 'Verified' | 'Needs Review'
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDxQMub5mJyvN_Cs0E38s9xswudAcqO5X1pfkR06mQ9H4cANALe-RShm66y8uZrtbGXITAnGU97gPcBG1HxPMouEpayXk9lS22aks08N7qc7YlAHbY-EvpD3oNl4In5MZ2NyErdZsiluw6XQInHb8yI7WwG9iwPRHJ53GA0uiY7rjQrckh6NpKndXo1NcYuzwLkVt6b9_qycEBm2s1OqplznGTFBvEM-BanNk-3yg9r5V04hqDvsjQmXGhkPhJBH2VpyjGKxj35ek'
        },
        {
          id: 'h-2',
          doctor: 'Dr. Sarah Jenkins',
          department: 'City Health Clinic • Neurology',
          date: 'Oct 22, 2024',
          medicinesCount: 2,
          medicines: [
            { name: 'Gabapentin', status: 'normal' },
            { name: 'Unknown Dosage', status: 'warning' }
          ],
          ocrMatch: '84.1%',
          status: 'Needs Review',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5PhyyzxXTzojwYWhOnYXDfPmp5GfFAquoq3RpTOiG6QEt9XjJCYQEOG53s5YNwofOMADGwVbazjb2b4svZapqlyqwd9Q5dPasaw_gDb-weVm_1TtsN0_ofFQ3VA8kKAJj6fHGrB_9tfKLqRrjuK0irx5xRfm5rm7Wgu5ZI1RFjgMi11PZI4Oh8Wm7JEqpoooiQXItGKtMzJVh5zwVzTAoR3-9Vw4amKKy0o__IZgh7oKQueg30toOr6rCa-2O65vXX-HiVT6wHNw'
        }
      ],

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
