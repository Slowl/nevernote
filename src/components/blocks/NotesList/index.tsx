import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useLocation, useSearchParams } from 'react-router-dom'
import { styled } from '@linaria/react'
import { TbNoteOff, TbPencilPlus } from 'react-icons/tb'
import { Tables } from '@/types/database'
import { useNoteStore } from '@/store/index'
import { routes } from '@/routes/index'
import { getNotesByCategory } from '@/utils/api'
import { NoteCategory } from '@/types/index'
import { supabase } from '@/services/supabase'
import NoteCard from '@/components/ui/NoteCard'

//#region NOTESLIST CONTAINER
//#region STYLES
const NotesListContainer = styled.div`
	min-width: 20rem;
	max-width: 20rem;
	background-color: var(--color-black-1);
	border-radius: 0 20px 20px 0;
	display: flex;
	flex-direction: column;
`

const TopContainer = styled.div`
	padding: 1rem .5rem 1.7rem;
`
const CreateNoteButton = styled.div`
	border: 1px solid var(--color-black-5);
	background-color: var(--color-black-1);
	border-radius: 30px;
	padding: .5rem 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: .85rem;
	width: 80%;
	margin: auto;
	cursor: pointer;
	transition: .2s;

	&:hover {
		border-color: var(--color-black-3);
		background-color: var(--color-black-3);
	}
`

const BottomContainer = styled.div`
	padding: .5rem 1rem;
	flex-grow: 1;
	overflow-y: auto;
`
//#endregion

export const NotesListLayout = () => {

	const [_, setSearchParams] = useSearchParams()
	const setViewedNoteEmpty = useNoteStore((state) => state.setViewedNoteEmpty)

	const handleCreateNewNote = () => {
		setSearchParams(undefined)
		setViewedNoteEmpty()
	}

	return (
		<NotesListContainer>
			<TopContainer>
				<CreateNoteButton onClick={handleCreateNewNote}>
					<div>new note</div> <TbPencilPlus />
				</CreateNoteButton>
			</TopContainer>
			<BottomContainer>
				<Outlet />
			</BottomContainer>
		</NotesListContainer>
	)
}
//#endregion

//#region NOTESLIST
//#region STYLES
const NoteCardListContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem 0;
`
const NoNoteView = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	> svg {
		width: 2.5rem;
		height: 2.5rem;
	}
`
//#endregion
export const NotesList = () => {

	const prefetchedNotes = useLoaderData() as Tables<'notes'>[]
	const location = useLocation()
	const { pathname } = location
	const [_, setSearchParams] = useSearchParams()
	const [notes, setNotes] = useState(prefetchedNotes)
	const selectedNote = useNoteStore((state) => state.note)
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

	if (notes.length === 0) {
		return (
			<NoNoteView>
				<TbNoteOff />
				<div> No notes yet ... </div>
			</NoNoteView>	
		)
	}

	return (
		<NoteCardListContainer>
			{notes.map((note: Tables<'notes'> & { profiles?: Tables<'profiles'> }) => (
				<NoteCard
					onClick={() => (note.id !== selectedNote?.id) && handleSelectNote(note)}
					note={note}
					key={note.id}
				/>
			))}
		</NoteCardListContainer>
	)
}
//#endregion