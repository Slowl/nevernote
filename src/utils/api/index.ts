import { OutputData } from '@editorjs/editorjs'
import { supabase } from '@/services/supabase'
import { NoteCategory } from '@/types/index'

//#region GET
export const getNotesByCategory = async (category: NoteCategory | string) => {
	const { data: { session } } = await supabase.auth.getSession()
	if (session) {
		if (category === NoteCategory.MY_NOTES) {
			const { data } = await supabase.from('notes')
				.select()
				.eq('created_by', session?.user.id)
				.is('public_url', null).is('is_archived', false)
				.order('updated_at', { ascending: false })
	
			return data
		}
		if (category === NoteCategory.SHARED) {
			const { data } = await supabase.from('notes')
				.select(`*, profiles(id, first_name, last_name, avatar)`)
				.contains('shared_with', [session?.user.id])
				.is('is_archived', false)
				.order('updated_at', { ascending: false })
	
			return data
		}
		if (category === NoteCategory.PUBLIC) {
			const { data } = await supabase.from('notes')
				.select()
				.eq('created_by', session?.user.id)
				.not('public_url', 'is', null).is('is_archived', false)
				.order('updated_at', { ascending: false })
	
			return data
		}
		if (category === NoteCategory.ARCHIVED) {
			const { data } = await supabase.from('notes')
				.select()
				.eq('created_by', session?.user.id)
				.is('is_archived', true)
				.order('updated_at', { ascending: false })
	
			return data
		}

		return null
	}

	throw new Error('Can\t fetch notes without a valid session')
}
//#endregion

//#region CREATE
export const createNote = async ({
	title,
	content,
	created_by,
}: {
	title: string;
	content?: OutputData;
	created_by: string;
}) => {
	try {
		const { error, data } = await supabase
		.from('notes')
		.insert({ title, content, created_by, is_archived: false })
		.select()

		if (error) {
			console.error('Error while creating a note: ', error)
			throw new Error(`Error while creating a note: ${error}`)
		}
		
		return data
	} catch (error) {
		console.error('Error: ', error)
		throw new Error(`Error: ${error}`)
	}
}
//#endregion

//#region UPDATE
export const updateNote = async ({
	id,
	title,
	content,
	is_archived,
	updated_by,
}: {
	id: string;
	title?: string;
	content?: OutputData;
	is_archived?: boolean;
	updated_by: string;
}) => {
	try {
		const { error } = await supabase
		.from('notes')
		.update({
			title,
			content,
			is_archived,
			updated_at: new Date(),
			updated_by,
		})
		.eq('id', id)

		if (error) {
			console.error('Error while updating a note: ', error)
			throw new Error(`Error while updating a note: ${error}`)
		}

		return Promise.resolve()
	} catch (error) {
		console.error('Error: ', error)
		throw new Error(`Error: ${error}`)
	}
}
//#endregion

//#region DELETE
export const deleteNote = async ({ id }: {
	id: string;
}) => {
	try {
		const { error } = await supabase
		.from('notes')
		.delete()
		.eq('id', id)

		if (error) {
			console.error('Error while deleting a note: ', error)
			throw new Error(`Error while deleting a note: ${error}`)
		}
		
		return Promise.resolve()
	} catch (error) {
		console.error('Error: ', error)
		throw new Error(`Error: ${error}`)
	}
}
//#endregion