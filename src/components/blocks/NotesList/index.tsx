import { useEffect, useState } from 'react'
import { styled } from '@linaria/react'
import { Outlet, useLoaderData, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { TbNoteOff, TbPencilPlus } from 'react-icons/tb'
import { routes } from '@/routes/index'
import { supabase } from '@/services/supabase'
import { Tables } from '@/types/database'
import { NoteCategory } from '@/types/index'
import { useNoteStore } from '@/store/index'
import { getNotesByCategory } from '@/utils/api'
import NoteCard from '@/components/ui/NoteCard'

//#region NOTESLIST CONTAINER
//#region STYLES
const NotesListContainer = styled.div<{ isVisible: boolean }>`
	display: flex;
	flex-direction: column;
	min-width: 20rem; max-width: 20rem;
	background-color: var(--color-black-1);
	border-radius: 0 20px 20px 0;

	@media screen and (max-width: 650px) {
		position: absolute;
		bottom: ${({ isVisible }) => (isVisible) ? '70px' : '-700px' };
		min-width: 100%; max-width: 100%;
		height: 89svh;
		border-radius: 20px 20px 0 0;
		z-index: 900;
		transition: cubic-bezier( 0.165, 0.84, 0.44, 1) .6s;
	}
`
const TopContainer = styled.div`
	padding: 1rem .5rem 1.7rem;
`
const CreateNoteButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 80%;
	padding: .5rem 1rem;
	margin: auto;
	background-color: var(--color-black-1);
	border: 1px solid var(--color-black-5);
	border-radius: 30px;
	font-size: .85rem;
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
	scrollbar-color: var(--color-black-3) rgba(0,0,0,0);
  scrollbar-width: thin;
`
//#endregion

export const NotesListLayout = () => {

	//#region SETUP
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const [searchParams, _] = useSearchParams()
	const isMobileListNoteVisible = useNoteStore((state) => state.isMobileListNoteVisible)
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const setIsMobileListNoteVisible = useNoteStore((state) => state.setIsMobileListNoteVisible)
	//#endregion

	//#region EVENTS
	const handleCreateNewNote = () => {
		setIsMobileListNoteVisible(false)
		setIsNoteFormLoading(false)
		if (searchParams.get('viewed') || (pathname !== routes.MY_NOTES.path)) {
			setIsNoteFormLoading(true)
			navigate(routes.MY_NOTES.path)
		}
	}
	//#endregion

	return (
		<NotesListContainer isVisible={isMobileListNoteVisible}>
			<TopContainer>
				<CreateNoteButton onClick={handleCreateNewNote}>
					<div> New note </div> <TbPencilPlus />
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
const NoteCardListContainer = styled.div<{ isVisible: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 1rem 0;

	@media screen and (max-width: 650px) {
		opacity: ${({ isVisible }) => (isVisible) ? 1 : 0};
		visibility: ${({ isVisible }) => (isVisible) ? 'visible' : 'hidden' };
		transition: 1s;
	}
`
const NoNoteView = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	gap: 1rem;

	> svg {
		width: 2.5rem; height: 2.5rem;
	}
`
//#endregion
export const NotesList = () => {

	//#region SETUP
	const location = useLocation()
	const { pathname } = location
	const prefetchedNotes = useLoaderData() as Tables<'notes'>[]
	const [_, setSearchParams] = useSearchParams()
	const [notes, setNotes] = useState(prefetchedNotes)
	const selectedNote = useNoteStore((state) => state.viewedNote)
	const isMobileListNoteVisible = useNoteStore((state) => state.isMobileListNoteVisible)
	const setIsMobileListNoteVisible = useNoteStore((state) => state.setIsMobileListNoteVisible)
	//#endregion

	//#region CORE
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
	//#endregion

	//#region EVENTS
	const handleSelectNote = (note: Tables<'notes'>) => {
		setIsMobileListNoteVisible(false)
		if ((note.id !== selectedNote?.id)) {
			setSearchParams((previousSearchParams) => ({ ...previousSearchParams, viewed: note.id }))
		}
	}
	//#endregion

	//#region RENDER
	if (notes.length === 0) {
		return (
			<NoNoteView>
				<TbNoteOff />
				<div> No notes yet ... </div>
			</NoNoteView>	
		)
	}

	return (
		<NoteCardListContainer isVisible={isMobileListNoteVisible}>
			{notes.map((note: Tables<'notes'> & { profiles?: Tables<'profiles'> }) => (
				<NoteCard
					onClick={() => handleSelectNote(note)}
					note={note}
					key={note.id}
				/>
			))}
		</NoteCardListContainer>
	)
	//#endregion
}
//#endregion