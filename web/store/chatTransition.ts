import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Attachment } from 'ai';
import { ChatService } from '@/services/chat.service';

interface ChatTransitionState {
  query: string;
  files: File[];
  chatId: string | null;
  isUploading: boolean;

  setQuery: (query: string) => void;
  setFiles: (files: File[]) => void;
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  setChatId: (id: string) => void;
  clearTransition: () => void;
  uploadAttachments: () => Promise<Attachment[]>;
}

export const useChatTransitionStore = create<ChatTransitionState>()(
  persist(
    (set, get) => ({
      query: '',
      files: [],
      chatId: null,
      isUploading: false,

      setQuery: (query) => set({ query }),

      setFiles: (files) => set({ files }),

      addFiles: (newFiles) => {
        set((state) => ({
          files: [...state.files, ...newFiles],
        }));
      },

      removeFile: (index) => {
        set((state) => ({
          files: state.files.filter((_, i) => i !== index),
        }));
      },

      setChatId: (id) => set({ chatId: id }),

      clearTransition: () =>
        set({
          query: '',
          files: [],
          chatId: null,
        }),

      uploadAttachments: async () => {
        set({ isUploading: true });
        if (get().files.length === 0) {
          set({ isUploading: false });
          return [];
        }
        const formData = new FormData();
        get().files.forEach((file) => {
          formData.append('files', file);
        });
        const result = await ChatService.uploadFiles(formData);
        set({ isUploading: false });
        return result.data || [];
      },
    }),
    {
      name: 'chat-transition-storage',
      skipHydration: typeof window === 'undefined',
    }
  )
);
