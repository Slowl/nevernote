import { Dispatch, SetStateAction, memo, useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import { TbNoteOff, TbPlus } from 'react-icons/tb'
import { styled } from '@linaria/react'
import { useQuery, useSubscription } from '@supabase-cache-helpers/postgrest-react-query'
import { getNotesByCategory } from '@/utils/queries'
import { supabase } from '@/services/supabase'
import { Tables } from '@/types/database'
import { NoteCategory } from '@/types/index'
import { routes } from '@/routes/index'
import { useGeneralStore, useNoteStore, useUserStore } from '@/store/index'
import NoteCard from '@/components/ui/NoteCard'
import Loader from '@/components/ui/Loader'

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
		height: 88svh;
		border-radius: 20px 20px 0 0;
		padding-top: 3rem;
		transform: ${({ isVisible }) => (isVisible) ? 'translateY(-65px)' : 'translateY(110%)' };
		z-index: 998;
		transition: transform ease .5s;
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
		display: none;
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
		padding: .5rem 1rem 1rem;
		border-top: 1px solid var(--color-black-3);
	}
`
const MobileOverlay = styled.div<{ isVisible: boolean }>`
	display: none;
	width: 100%; height: 100%;
	position: fixed;
	top: 0; left: 0;
	background-color: var(--color-black-0);
	transition: .4s;
	z-index: 900;
	@media screen and (max-width: 650px) {
		display: block;
		opacity: ${({ isVisible }) => (isVisible) ? 1 : 0};
		visibility: ${({ isVisible }) => (isVisible) ? 'visible' : 'hidden'};
	}
`
//#endregion

export const NotesListLayout = () => {

	//#region SETUP
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const [listTitle, setListTitle] = useState('')
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const resetViewedNote = useNoteStore((state) => state.resetViewedNote)
	const isMobileListNoteVisible = useGeneralStore((state) => state.isMobileListNoteVisible)
	const setIsMobileListNoteVisible = useGeneralStore((state) => state.setIsMobileListNoteVisible)
	//#endregion

	//#region EVENTS
	const handleCreateNewNote = () => {
		if (searchParams.get('viewed')) {
			if ((searchParams.get('viewed') === 'new')) {
				return setIsMobileListNoteVisible(false)
			}
			setSearchParams((previousSearchParams) => ({ ...previousSearchParams, viewed: 'new' }))
			setIsNoteFormLoading(true)
			resetViewedNote()
		}
		setIsMobileListNoteVisible(false)
		setIsNoteFormLoading(true)
		navigate(`${routes.MY_NOTES.path}?viewed=new`)
	}
	//#endregion

	return (
		<>
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
			<MobileOverlay isVisible={isMobileListNoteVisible} />
		</>
	)
}
//#endregion

//#region NOTESLIST
//#region STYLES
const NoteCardListContainer = styled.div<{ isVisible: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 1rem 0;
`
const FallbackView = styled.div`
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

export const NotesList = memo(({ category, currentPageTitle }: {
	category: NoteCategory;
	currentPageTitle: string;
}) => {

	//#region SETUP
	const { setListTitle }: { setListTitle: Dispatch<SetStateAction<string>> } = useOutletContext()
	const [_, setSearchParams] = useSearchParams()
	const selectedNote = useNoteStore((state) => state.viewedNote)
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const isMobileListNoteVisible = useGeneralStore((state) => state.isMobileListNoteVisible)
	const setIsMobileListNoteVisible = useGeneralStore((state) => state.setIsMobileListNoteVisible)
	const currentUserId = useUserStore((state) => state.currentUserId)
	//#endregion

	//#region CORE
	const { data: notes, isLoading: areNotesLoading } = useQuery(
		getNotesByCategory({ category, currentUserId: currentUserId ?? 'user-id' }),
		{ enabled: !!(currentUserId) }
	)

	useSubscription(supabase, 'custom-all-channel',
		{
			event: '*',
			schema: 'public',
			table: 'notes',
		},
		['id'],
	)
	
	useEffect(
		() => setListTitle(currentPageTitle),
		[currentPageTitle],
	)
	//#endregion

	//#region EVENTS
	const handleSelectNote = useCallback(
		(note: Tables<'notes'>) => {
			setIsMobileListNoteVisible(false)
			if ((note.id !== selectedNote?.id)) {
				setSearchParams((previousSearchParams) => ({ ...previousSearchParams, viewed: note.id }))
				setIsNoteFormLoading(true)
			}
		},
		[selectedNote?.id],
	)
	//#endregion

	//#region RENDER
	if (areNotesLoading) {
		return <FallbackView> <Loader /> </FallbackView>
	}

	if (!(notes) || (notes.length === 0)) {
		return (
			<FallbackView>
				<TbNoteOff />
				<div> No notes yet ... </div>
			</FallbackView>	
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
})
//#endregion