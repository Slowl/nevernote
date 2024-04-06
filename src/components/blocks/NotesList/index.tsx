import { useEffect, useState } from 'react'
import { styled } from '@linaria/react'
import { Outlet, useLoaderData, useLocation, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import { TbNoteOff, TbPlus } from 'react-icons/tb'
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
	position: relative;
	background-color: var(--color-black-1);
	border-radius: 0 20px 20px 0;

	@media screen and (max-width: 650px) {
		flex-direction: column-reverse;
		position: absolute;
		bottom: 0;
		min-width: 100%; max-width: 100%;
		height: 90svh;
		border-radius: 20px 20px 0 0;
		padding-top: 3rem;
		transform: ${({ isVisible }) => (isVisible) ? 'translateY(-65px)' : 'translateY(110%)' };
		z-index: 900;
		transition: transform cubic-bezier(0.165, 0.84, 0.44, 1) .65s;
	}
`
const ListTitle = styled.div`
	display: none;
	@media screen and (max-width: 650px) {
		display: block;
		position: absolute;
		top: 8px;
		left: 12px;
		font-size: 1.2rem;
		font-weight: bold;
	}
`
const TopContainer = styled.div`
	padding: 1rem .5rem 1.7rem;
	@media screen and (max-width: 650px) {
		padding: 1rem .5rem 1rem;
	}
`
const CreateNoteButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80%;
	padding: .5rem 1rem;
	margin: auto;
	border: 1px solid var(--color-black-3);
	background-color: var(--color-black-5);
	border-radius: 30px;
	font-size: 1.3rem;
	cursor: pointer;
	transition: .2s;

	&:hover {
		border: 1px solid var(--color-grey-3);
		background-color: var(--color-black-6);
	}
	@media screen and (max-width: 650px) {
		padding: .7rem 1rem;
	}
`
const BottomContainer = styled.div`
	padding: .5rem 1rem;
	flex-grow: 1;
	overflow-y: auto;
	scrollbar-color: var(--color-black-3) rgba(0,0,0,0);
  scrollbar-width: thin;
	@media screen and (max-width: 650px) {
		border-top: 1px solid var(--color-black-3);
	}
`
//#endregion

export const NotesListLayout = () => {

	//#region SETUP
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const [listTitle, setListTitle] = useState('')
	const isMobileListNoteVisible = useNoteStore((state) => state.isMobileListNoteVisible)
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const setIsMobileListNoteVisible = useNoteStore((state) => state.setIsMobileListNoteVisible)
	const setViewedNote = useNoteStore((state) => state.setViewedNote)
	//#endregion

	//#region EVENTS
	const handleCreateNewNote = () => {
		if (searchParams.get('viewed')) {
			if ((searchParams.get('viewed') === 'new')) {
				return setIsMobileListNoteVisible(false)
			}
			setSearchParams((previousSearchParams) => ({ ...previousSearchParams, viewed: 'new' }))
			setViewedNote({ title: '', content: {
					blocks: [],
					time: 1712106748497,
					version: '2.29.1'
				}
			})
		}
		setIsMobileListNoteVisible(false)
		setIsNoteFormLoading(true)
		navigate(`${routes.MY_NOTES.path}?viewed=new`)
	}
	//#endregion

	return (
		<NotesListContainer isVisible={isMobileListNoteVisible}>
			<ListTitle> {listTitle} </ListTitle>
			<TopContainer>
				<CreateNoteButton onClick={handleCreateNewNote}>
					<TbPlus />
				</CreateNoteButton>
			</TopContainer>
			<BottomContainer>
				<Outlet context={{ setListTitle }}/>
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
		visibility: ${({ isVisible }) => (isVisible) ? 'visible' : 'hidden'};
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
export const NotesList = ({ currentPageTitle }: { currentPageTitle: string }) => {

	//#region SETUP
	const location = useLocation()
	const { pathname } = location
	const { setListTitle }: any = useOutletContext()
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
			setListTitle(currentPageTitle)
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