import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { OutputData } from '@editorjs/editorjs'
import { supabase } from '@/services/supabase'
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
	updatedBy?: Tables<'profiles'>;
	viewedNote?: Partial<Tables<'notes'>> & { profiles?: Partial<Tables<'profiles'>>};
	setContent: (content?: OutputData) => void;
	setIsNoteFormLoading: (isLoading: boolean) => void;
	setTitle: (title: Tables<'notes'>['title']) => void;
	getUpdatedBy: (userId: string) => Promise<Tables<'profiles'> | null>;
	getViewedNote: (noteId: string) => Promise<Tables<'notes'> | null>;
	resetViewedNote: () => void;
}

export const useNoteStore = create<NoteState>()(devtools((set) => ({
	isNoteFormLoading: false,
	updatedBy: undefined,
	viewedNote: undefined,
	setContent: (content) => set((state) => ({ viewedNote: { ...state.viewedNote, content } })),
	setIsNoteFormLoading: (isLoading) => set(() => ({ isNoteFormLoading: isLoading })),
	setTitle: (title) => set((state) => ({ viewedNote: { ...state.viewedNote, title } })),
		getUpdatedBy: async (userId: string) => {
		const { data } = await supabase.from('profiles')
		.select()
		.eq('id', userId)
		.limit(1)

		if (data) {
			data && set({ updatedBy: data[0] })
			
			return data[0]
		}

		return Promise.reject()
	},
	getViewedNote: async (noteId: string) => {
		const { data } = await supabase.from('notes')
		.select()
		.eq('id', noteId)
		.limit(1)

		if (data) {
			data && set({ viewedNote: data[0] })
			
			return data[0]
		}

		return Promise.reject()
	},
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
	currentUser?: Tables<'profiles'>;
	getCurrentUser: (userId: string) => Promise<Tables<'profiles'> | null>;
	resetCurrentUser: () => void;
}

export const useUserStore = create<UserState>()(devtools((set) => ({
	currentUser: undefined,
	getCurrentUser: async (userId: string) => {
		const { data } = await supabase
		.from('profiles')
		.select()
		.eq('id', userId)

		if (data) {
			data && set({ currentUser: data[0] })
			
			return data[0]
		}

		return Promise.reject()
	},
	resetCurrentUser: () => set(() => ({ currentUser: undefined }))
}), { name: 'USER STORE' }))