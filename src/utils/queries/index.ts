import { supabase } from '@/services/supabase'
import { NoteCategory } from '@/types/index'

//#region NOTE
//#region GET SINGLE NOTE
export const getNote = ({ noteId }: { noteId: string }) => {
	return (
		supabase.from('notes')
			.select(`
				id,
				title,
				content,
				created_by,
				created_at,
				updated_by,
				updated_at,
				is_archived,
				shared_with,
				public_url
			`)
			.eq('id', noteId)
			.single()
	)
}
//#endregion

//#region GET MULTIPLE NOTES
export const getNotesByCategory = ({ category, currentUserId }: {
	category: NoteCategory | string;
	currentUserId?: string;
}) => {
	if (currentUserId) {
		if (category === NoteCategory.MY_NOTES) {
			return supabase.from('notes')
				.select(`
					id,
					title,
					content,
					created_by,
					created_at,
					updated_by,
					updated_at,
					is_archived,
					shared_with,
					public_url
			`)
				.eq('created_by', currentUserId)
				.is('public_url', null).is('is_archived', false)
				.order('updated_at', { ascending: false })
		}
		if (category === NoteCategory.SHARED) {
			return supabase.from('notes')
				.select(`
					id,
					title,
					content,
					created_by,
					created_at,
					updated_by,
					updated_at,
					is_archived,
					shared_with,
					public_url,
					profiles(id, first_name, last_name, avatar)
				`)
				.contains('shared_with', [currentUserId])
				.is('is_archived', false)
				.order('updated_at', { ascending: false })
		}
		if (category === NoteCategory.PUBLIC) {
			return supabase.from('notes')
				.select(`
					id,
					title,
					content,
					created_by,
					created_at,
					updated_by,
					updated_at,
					is_archived,
					shared_with,
					public_url
			`)
				.eq('created_by', currentUserId)
				.not('public_url', 'is', null).is('is_archived', false)
				.order('updated_at', { ascending: false })
		}
		if (category === NoteCategory.ARCHIVED) {
			return supabase.from('notes')
				.select(`
					id,
					title,
					content,
					created_by,
					created_at,
					updated_by,
					updated_at,
					is_archived,
					shared_with,
					public_url
			`)
				.eq('created_by', currentUserId)
				.is('is_archived', true)
				.order('updated_at', { ascending: false })
		}
	}

	throw new Error('Can\t fetch notes without a valid session')
}
//#endregion
//#endregion

//#region USER
//#region GET USER
export const getUser = ({ userId }: { userId: string; }) => {
	return (
		supabase.from('profiles')
			.select('id, first_name, last_name, avatar')
			.eq('id', userId)
			.single()
	)
}
//#endregion
//#endregion