import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { OutputData } from '@editorjs/editorjs'
import { Tables } from '@/types/database'

interface GeneralState {
	isMobileListNoteVisible: boolean;
	setIsMobileListNoteVisible: (isVisible: boolean) => void;
}

export const useGeneralStore = create<GeneralState>()(devtools((set) => ({
	isMobileListNoteVisible: true,
	setIsMobileListNoteVisible: (isVisible) => set(() => ({ isMobileListNoteVisible: isVisible })),
}), { name: 'GENERAL STORE' }))

interface NoteState {
	isNoteFormLoading: boolean;
	viewedNote?: Partial<Tables<'notes'>> & { profiles?: Partial<Tables<'profiles'>>};
	setContent: (content?: OutputData) => void;
	setIsNoteFormLoading: (isLoading: boolean) => void;
	setTitle: (title: Tables<'notes'>['title']) => void;
	setViewedNote: (note: Tables<'notes'>) => void;
	resetViewedNote: () => void;
}

export const useNoteStore = create<NoteState>()(devtools((set) => ({
	isNoteFormLoading: false,
	viewedNote: undefined,
	setContent: (content) => set((state) => ({ viewedNote: { ...state.viewedNote, content } })),
	setIsNoteFormLoading: (isLoading) => set(() => ({ isNoteFormLoading: isLoading })),
	setTitle: (title) => set((state) => ({ viewedNote: { ...state.viewedNote, title } })),
	setViewedNote: (note) => set(()=> ({ viewedNote: note })),
	resetViewedNote: () => set(() => ({
		viewedNote: {
			title: '',
			content: {
				blocks: [],
				time: 1712106748497,
				version: '2.29.1'
			}
		},
	})),
}), { name: 'NOTE STORE' }))

interface UserState {
	currentUserId?: string;
	setCurrentUserId: (currentUserId: string) => void;
	resetCurrentUser: () => void;
}

export const useUserStore = create<UserState>()(devtools((set) => ({
	currentUserId: undefined,
	setCurrentUserId: (currentUserId) => set(() => ({ currentUserId })),
	resetCurrentUser: () => set(() => ({ currentUserId: undefined }))
}), { name: 'USER STORE' }))