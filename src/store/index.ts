import { create } from 'zustand'
import { OutputData } from '@editorjs/editorjs';
import { Tables } from '@/types/database'

interface NoteState {
	isNoteFormLoading: boolean;
	viewedNote?: Partial<Tables<'notes'>> & { profiles?: Partial<Tables<'profiles'>>};
	isMobileListNoteVisible: boolean;
	setContent: (content?: OutputData) => void;
	setIsNoteFormLoading: (isLoading: boolean) => void;
	setIsMobileListNoteVisible: (isVisible: boolean) => void;
	setTitle: (title: Tables<'notes'>['title']) => void;
	setViewedNote: (note: NoteState['viewedNote']) => void;
}

export const useNoteStore = create<NoteState>()((set) => ({
	isNoteFormLoading: false,
	viewedNote: undefined,
	isMobileListNoteVisible: true,
	setContent: (content) => set((state) => ({ viewedNote: { ...state.viewedNote, content } })),
	setIsNoteFormLoading: (isLoading) => set(() => ({ isNoteFormLoading: isLoading })),
	setIsMobileListNoteVisible: (isVisible) => set(() => ({ isMobileListNoteVisible: isVisible })),
	setTitle: (title) => set((state) => ({ viewedNote: { ...state.viewedNote, title } })),
	setViewedNote: (note) => set(() => ({ viewedNote: note })),
}))

interface UserState {
	currentUser?: Tables<'profiles'>;
	updatedBy?: Tables<'profiles'>;
	setCurrentUser: (user: UserState['currentUser']) => void;
	setUpdatedBy: (user?: Tables<'profiles'>) => void;
}

export const useUserStore = create<UserState>()((set) => ({
	currentUser: undefined,
	updatedBy: undefined,
	setCurrentUser: (user) => set(() => ({ currentUser: user })),
	setUpdatedBy: (user) => set(() =>({ updatedBy: user }))
}))