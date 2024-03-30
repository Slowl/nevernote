import { create } from 'zustand'
import { Tables } from '@/types/database'

interface NoteState {
	note: Partial<Tables<'notes'>> | null
	setViewedNote: (note: NoteState['note']) => void;
	setViewedNoteEmpty: () => void;
	setTitle: (title: string) => void;
	setContent: (content: string) => void;
}

export const useNoteStore = create<NoteState>()((set) => ({
	note: null,
	setViewedNote: (note) => set(() => ({ note })),
	setViewedNoteEmpty: () => set(() => ({ note: null })),
	setTitle: (title) => set((state) => ({ note: { ...state.note, title } })),
	setContent: (content) => set((state) => ({ note: { ...state.note, content } })),
}))
