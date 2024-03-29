import { Tables } from '@/types/database'
import { useNoteStore } from '@/store/index'
import { styled } from '@linaria/react'
import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useLocation, useSearchParams } from 'react-router-dom'
import { routes } from '@/routes/index'
import { getNotesByCategory } from '@/utils/api'
import { NoteCategory } from '@/types/index'
import { supabase } from '@/services/supabase'

//#region NOTESLIST CONTAINER
//#region STYLES
const NotesListContainer = styled.div`
	min-width: 20rem;
	background-color: var(--color-black-1);
	border-radius: 0 20px 20px 0;
	display: flex;
	flex-direction: column;
`

const TopContainer = styled.div`
	padding: .5rem;
`

const BottomContainer = styled.div`
	padding: .5rem;
	flex-grow: 1;
	overflow-y: auto;
`
//#endregion

export const NotesListLayout = () => {

	return (
		<NotesListContainer>
			<TopContainer>
				top
			</TopContainer>
			<BottomContainer>
				<Outlet />
			</BottomContainer>
		</NotesListContainer>
	)
}
//#endregion

//#region NOTESLIST
export const NotesList = () => {

	const prefetchedNotes = useLoaderData() as Tables<'notes'>[]
	const location = useLocation()
	const { pathname } = location
	const [_, setSearchParams] = useSearchParams()
	const [notes, setNotes] = useState(prefetchedNotes)
	const selectNote = useNoteStore((state) => state.setViewedNote)

	useEffect(
		() => {
			setNotes(prefetchedNotes)
			const currentRouteIndex = Object.values(routes).findIndex(({ path }) => path === pathname)
	
			supabase.channel('custom-all-channel')
				.on(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'notes' },
					() => {
						getNotesByCategory(Object.keys(NoteCategory)[currentRouteIndex])
							.then((fetchedNotes) => fetchedNotes && setNotes(fetchedNotes))
							.catch((error) => new Error(error))
					}
				)
				.subscribe()
		},
		[pathname],
	)

	const handleSelectNote = (note: Tables<'notes'>) => {
		setSearchParams((previousSearchParams) => ({ ...previousSearchParams, viewed: note.id }))
		selectNote(note)
	}

	return (
		<>
			{notes?.map((note: any, index) => <div key={index} onClick={() => handleSelectNote(note)}>{note.title}</div>)}
		</>
	)
}
//#endregion