import { create } from 'zustand'
import { OutputData } from '@editorjs/editorjs';
import { Tables } from '@/types/database'

interface NoteState {
	isNoteFormLoading: boolean;
	viewedNote?: Partial<Tables<'notes'>> & { profiles?: Partial<Tables<'profiles'>>};
	setContent: (content?: OutputData) => void;
	setIsNoteFormLoading: (isLoading: boolean) => void;
	setTitle: (title: Tables<'notes'>['title']) => void;
	setViewedNote: (note: NoteState['viewedNote']) => void;
}

export const useNoteStore = create<NoteState>()((set) => ({
	isNoteFormLoading: false,
	viewedNote: undefined,
	setContent: (content) => set((state) => ({ viewedNote: { ...state.viewedNote, content } })),
	setIsNoteFormLoading: (isLoading) => set(() => ({ isNoteFormLoading: isLoading })),
	setTitle: (title) => set((state) => ({ viewedNote: { ...state.viewedNote, title } })),
	setViewedNote: (note) => set(() => ({ viewedNote: note })),
}))

interface UserState {
	currentUserId?: string;
	updatedBy?: Tables<'profiles'>;
	setCurrentUserId: (user: UserState['currentUserId']) => void;
	setUpdatedBy: (user?: Tables<'profiles'>) => void;
}

export const useUserStore = create<UserState>()((set) => ({
	currentUserId: undefined,
	updatedBy: undefined,
	setCurrentUserId: (userId) => set(() => ({ currentUserId: userId })),
	setUpdatedBy: (user) => set(() =>({ updatedBy: user }))
}))