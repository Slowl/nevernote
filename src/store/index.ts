import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { OutputData } from '@editorjs/editorjs'
import type { Tables } from '@/types/database'
import { Toast } from '@/types/index';

export interface GeneralState {
	isMobileListNoteVisible: boolean;
	setIsMobileListNoteVisible: (isVisible: boolean) => void;
	isToolbarActionsVisible: boolean;
	setIsToolbarActionsVisible: (isVisible: boolean) => void;
	toast?: Toast;
	setToast: (toastItem: Toast) => void;
}

export const useGeneralStore = create<GeneralState>()(devtools((set) => ({
	isMobileListNoteVisible: true,
	isToolbarActionsVisible: true,
	toast: undefined,
	setIsMobileListNoteVisible: (isVisible) => set(() => ({ isMobileListNoteVisible: isVisible })),
	setIsToolbarActionsVisible: (isVisible) => set(() => ({ isToolbarActionsVisible: isVisible })),
	setToast: (toastItem) => set(() => ({ toast: toastItem }))
}), { name: 'GENERAL STORE' }))

export interface NoteState {
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

export interface UserState {
	currentUserId?: string;
	setCurrentUserId: (currentUserId: string) => void;
	resetCurrentUser: () => void;
}

export const useUserStore = create<UserState>()(devtools((set) => ({
	currentUserId: undefined,
	setCurrentUserId: (currentUserId) => set(() => ({ currentUserId })),
	resetCurrentUser: () => set(() => ({ currentUserId: undefined }))
}), { name: 'USER STORE' }))