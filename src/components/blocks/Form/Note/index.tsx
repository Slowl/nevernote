import { memo, useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { TbDeviceFloppy, TbInfoCircle, TbCopy, TbExternalLink, TbArrowBackUp, TbArrowForwardUp, TbChevronDown, TbChevronUp, TbColorSwatch } from 'react-icons/tb'
import { styled } from '@linaria/react'
import { useInsertMutation, useQuery, useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { supabase } from '@/services/supabase'
import type { Tables } from '@/types/database'
import { getNote, getUser } from '@/utils/queries'
import { useGeneralStore, useNoteStore, useUserStore } from '@/store/index'
import type { NoteState } from '@/store/index'
import { ToastTemplates } from '@/components/ui/Toast'
import User from '@/components/ui/User'
import Editor from '@/components/ui/Editor'
import Loader from '@/components/ui/Loader'
import PopoverModal from '@/components/ui/PopoverModal'
import ActionsBar, { type ActionsBarProps } from '@/components/ui/ActionsBar'
import Button from '@/components/ui/Button'

//#region STYLES
const FormNoteContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 1rem .2rem;
	z-index: 0;
	@media screen and (max-width: 650px) {
		height: calc(100svh - 48px);
		min-height: calc(100svh - 48px);
		max-height: calc(100svh - 48px);
	}
`
const FormInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 100%;
	margin-bottom: 1rem;
	gap: .5rem 0;
	overflow-y: auto;
	scrollbar-color: var(--color-black-3) rgba(0,0,0,0);
	scrollbar-width: thin;

	@media screen and (max-width: 650px) {
		overflow-x: hidden;
		margin-bottom: 2.4rem;
	}
`
const FormBody = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	height: 85svh; min-height: 85vh; max-height: 85svh;
`
//#endregion

const editorId = 'note-editor'
const FormNote = memo(() => {

	//#region SETUP
	const { pathname } = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const viewedNoteId = searchParams.get('viewed')
	const viewedNote = useNoteStore((state) => state.viewedNote)
	const isNoteFormLoading = useNoteStore((state) => state.isNoteFormLoading)
	const setViewedNote = useNoteStore((state) => state.setViewedNote)
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const resetViewedNote = useNoteStore((state) => state.resetViewedNote)
	const currentUserId = useUserStore((state) => state.currentUserId)
	const setToast = useGeneralStore((state) => state.setToast)
	//#endregion
	
	//#region CORE
	//#region QUERIES
	const { data: fetchedNote, status, isFetched, isLoading: isNoteLoading } = useQuery(
		getNote({ noteId: viewedNoteId ?? '' }),
		{ enabled: !!(viewedNoteId) && viewedNoteId !== 'new' }
	)
	const { data: currentUser } = useQuery(
		getUser({ userId: currentUserId ?? '' }),
		{ enabled: !!(currentUserId) }
	)
	//#endregion

	//#region MUTATIONS
	const { mutateAsync: createNote } = useInsertMutation(
		supabase.from('notes'),
		['id'],
		`id, title, content, updated_at, created_by, is_archived`,
		{ 
			onSuccess: (newNotes) => {
				setToast(ToastTemplates.successNoteCreate)
				const newNote = newNotes?.at(0)
				if (newNote && newNote.id) {
					setSearchParams((previousSearchParams) => ({ ...previousSearchParams, viewed: newNote.id }))
				}
			},
			onError: (error) => {
				setToast({ ...ToastTemplates.errorNote, content: 'Could not create the note...' })
				console.error('Error while creating a note: ', error)
				throw new Error(`Error while creating a note: ${error}`)
			}
		}
	)
	const { mutateAsync: updateNote } = useUpdateMutation(
		supabase.from('notes'),
		['id'],
		`id, title, content, updated_at, updated_by`,
		{
			onError: (error) => {
				setToast({ ...ToastTemplates.errorNote, content: 'Could not update the note...' })
				console.error('Error while updating a note: ', error)
				throw new Error(`Error while updating a note: ${error}`)
			}
		}
	)
	//#endregion

	useEffect(
		() => {
			setIsNoteFormLoading(true)
			if ((status === 'success' || isFetched) && fetchedNote) {
				setViewedNote(fetchedNote)
				setIsNoteFormLoading(false)
			} else {
				resetViewedNote()
				setIsNoteFormLoading(false)
			}

			return () => setIsNoteFormLoading(false)
		},
		[pathname, isFetched, status, viewedNoteId],
	)

	useHotkeys(
		['meta+s', 'ctrl+s'],
		async () => await handleCreateOrUpdate(viewedNote).then(
			() => setToast((viewedNote?.id) ? ToastTemplates.successNoteUpdate : ToastTemplates.successNoteCreate)
		),
		{ preventDefault: true, enableOnFormTags: true, enableOnContentEditable: true },
		[viewedNote?.id, viewedNote?.title, viewedNote?.content]
	)
	//#endregion
	
	//#region EVENTS
	const handleCreateOrUpdate = async (note: typeof viewedNote) => {
		if (currentUser && note?.title) {
			if (note?.id) {
				try {
					await updateNote({
						id: note.id,
						title: note.title ?? '',
						content: note.content,
						updated_by: currentUser.id,
						updated_at: new Date(),
					})
				} catch (error) {
					console.error('Error: ', error)
					throw new Error(`Error: ${error}`)
				}
			} else {
				try {
					await createNote([{
						title: note?.title ?? '',
						content: note?.content,
						created_by: currentUser.id,
						updated_at: new Date(),
						is_archived: false,
					}])
				} catch (error) {
					console.error('Error: ', error)
					throw new Error(`Error: ${error}`)
				}
			}
		}
	}
	//#endregion

	//#region RENDER
	return (
		<FormNoteContainer>
			<FormInputContainer>
				{(isNoteLoading)  
					? <Loader />
					: (
						<>
							<FormHead viewedNote={viewedNote}/>
							<FormBody>
								{
									((!(isNoteFormLoading) && (fetchedNote?.id)) || !(fetchedNote?.id)) && (
										<Editor
											configuration={{
												holder: editorId,
												data: fetchedNote?.content,
												autofocus: !!(fetchedNote?.title),
												placeholder: 'Write your note...',
											}}
											onChange={(data) => handleCreateOrUpdate({ ...fetchedNote, content: data })}
										/>
									)
								}
							</FormBody>
						</>
					)
				}
			</FormInputContainer>
			<FormToolBar
				viewedNote={viewedNote}
				fetchedNote={fetchedNote}
				currentUser={currentUser}
				handleCreateOrUpdate={handleCreateOrUpdate}
			/>
		</FormNoteContainer>
	)
	//#endregion
})

export default FormNote

//#region HEAD COMPONENT
//#region STYLES
const FormHeadContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	width: calc(100% - 110px);
	margin: auto;
	> input[type='text'] {
		flex-grow: 1;
		padding: .4rem 0;
		font-size: 1.3rem;
		font-weight: bold;
		border: 0;
		color: var(--color-grey-0);
		background-color: var(--color-black-0);

		&:focus-visible {
			outline: 0;
		}
	}

	.action-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		position: absolute;
		right: 25px;
		top: 20px;

		.action-button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 36px; height: 36px;
			padding: .1rem;
			font-size: 1.3rem;
			border-radius: 50%;
			cursor: pointer;
			transition: .2s;

			&:hover {
				background-color: var(--color-black-5);
			}
		}
	}
	@media screen and (max-width: 650px) {
		width: calc(100% - 35px);
		.action-container {
			right: 15px;
			top: 10px;
		}
	}
`
//#endregion

const FormHead = ({ viewedNote }: { viewedNote: NoteState['viewedNote'] }) => {

	//#region SETUP
	const setTitle = useNoteStore((state) => state.setTitle)
	//#endregion

	return (
		<FormHeadContainer>
			<input
				type='text'
				placeholder={`Write your note's title ...`}
				onChange={(event => setTitle(event.target.value))}
				value={viewedNote?.title}
			/>
			{/* <div className='action-container'>
				<div className='action-button'>
					<TbSettings />
				</div>
			</div> */}
		</FormHeadContainer>
	)
}
//#endregion

//#region TOOLBAR COMPONENT
//#region STYLES
const FormToolbar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 90%;
	margin: auto;
	padding: .5rem 0 .5rem;
	position: sticky;
	bottom: 0;
	border-top: 1px solid var(--color-black-4);

	.note-informations {
		display: flex;
		align-items: center;
		gap: .4rem;
		color: var(--color-grey-1);
		> div {
			font-size: .9rem;
		}
	}
	.note-actions {
		.button {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			padding: .3rem .8rem;
			margin: auto;
			border: 1px solid var(--color-black-5);
			background-color: var(--color-black-1);
			font-size: .85rem;
			border-radius: 40px;
			cursor: pointer;
			transition: .2s;

			> svg {
				width: 14px; height: 14px;
				flex-shrink: 0;
			}

			&:hover {
				border-color: var(--color-black-3);
				background-color: var(--color-black-3);
			}
		}

		.disabled {
			cursor: default;
			background-color: var(--color-black-5);
			color: var(--color-grey-2);
			&:hover {				
				background-color: var(--color-black-5);
				color: var(--color-grey-2);
			}
		}
	}

	@media screen and (max-width: 650px) {
		width: 95%;
		padding: .4rem .2rem .6rem;
		.note-informations {
			gap: .3rem;
			> div {
				font-size: .75rem;
			}
		}
		.note-actions {
			.button {
				padding: .35rem 1rem;
				font-size: .80rem;
				> svg {
					width: 14px; height: 14px;
				}
			}
		}
	}
`
const InformationContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: .3rem 0;

	div {
		display: flex;
		align-items: center;
		gap: .2rem;
	}
`

const ActionsBarContainer = styled.div<{ isVisible: boolean }>`
	position: absolute;
	bottom: ${({ isVisible }) => isVisible ? '31px' : '0px'};
	width: 100%;
	display: flex;
	justify-content: center;
	margin: auto;
	opacity: ${({ isVisible }) => isVisible ? 1 : 0};
	visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
	transition: .2s;

	@media screen and (max-width: 650px) {
		bottom: ${({ isVisible }) => isVisible ? '55px' : '0px'};
		left: -2px;
	}
`
const ActionsBarTrigger = styled.div<{ isActionsVisible: boolean }>`
	position: absolute;
	bottom: ${({ isActionsVisible }) => isActionsVisible ? '-2px' : '5px'};
	left: 0; right: 0;
	width: 30px; height: 30px;
	margin: auto;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--color-black-1);
	border: 1px solid var(--color-black-3);
	border-radius: 50%;
	opacity: ${({ isActionsVisible }) => isActionsVisible ? 0 : 1};
	visibility: ${({ isActionsVisible }) => isActionsVisible ? 'hidden' : 'visible'};
	cursor: pointer;
	user-select: none;
	transition: .2s;

	&:hover {
		background-color: var(--color-black-3);
	}

	@media screen and (max-width: 650px) {
		bottom: ${({ isActionsVisible }) => isActionsVisible ? '-2px' : '10px'};
	}
`
//#endregion
const FormToolBar = ({
	viewedNote,
	fetchedNote,
	currentUser,
	handleCreateOrUpdate,
}: {
	viewedNote: NoteState['viewedNote'];
	fetchedNote: Tables<'notes'> | null | undefined;
	currentUser: Pick<Tables<'profiles'>, 'id' | 'first_name' |'last_name' | 'avatar'> | null | undefined;
	handleCreateOrUpdate: (note: NoteState['viewedNote']) => Promise<void>;
}) => {

	//#region SETUP
	const editorElement = document.getElementById(editorId)
	const setToast = useGeneralStore((state) => state.setToast)
	const storedActionsVisible = localStorage.getItem('isActionsVisible') && JSON.parse(localStorage.getItem('isActionsVisible') ?? '')
	const [isActionsVisible, setIsActionsVisible] = useState((storedActionsVisible === null) ? true : storedActionsVisible)
	//#endregion

	//#region CORE
	const { data: createdBy } = useQuery(
		getUser({ userId: fetchedNote?.created_by ?? '' }),
		{ enabled: !!(fetchedNote?.created_by) }
	)
	const { data: updatedBy } = useQuery(
		getUser({ userId: fetchedNote?.updated_by ?? '' }),
		{ enabled: !!(fetchedNote?.updated_by) }
	)
	const { data: sharedWith } = useQuery(
		getUser({ userId: fetchedNote?.shared_with?.[0] ?? '' }),
		{ enabled: !!(fetchedNote?.shared_with?.[0]) }
	)
	//#endregion

	//#region EVENTS
	const copyToClipboard = async ({ textToCopy, successMessage }: {
		textToCopy: string;
		successMessage?: string;
	}) => {	
		try {
			await navigator.clipboard.writeText(textToCopy)
			setToast({
				...ToastTemplates.successNoteCreate,
				content: successMessage || 'Successfully copied to clipboard!'
			})
		} catch (error) {
			console.error(`An error occured whule copying to clipboard: ${error}`)
		}
	}
	const editorActions: ActionsBarProps['actions'] = [
		{
			label: 'Undo',
			icon: TbArrowBackUp,
			event: () => editorElement?.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'z', 'ctrlKey': true, 'metaKey': true })),
		},
		{
			label: 'Redo',
			icon: TbArrowForwardUp,
			event: () => editorElement?.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'z', 'ctrlKey': true, 'shiftKey': true, 'metaKey': true })),
		},
		{
			label: 'Colors',
			icon: TbColorSwatch,
			popover: {
				options: { placement: 'top' },
				content: <ColorPicker />
			},
		},
		{
			label: 'Hide',
			icon: TbChevronDown,
			event: () => {
				localStorage.setItem('isActionsVisible', JSON.stringify(false))
				setIsActionsVisible(false)
			}
		}
	]
	//#endregion

	return (
		<FormToolbar>
			{currentUser && (
				<>
					<ActionsBarContainer isVisible={isActionsVisible}>
						<ActionsBar actions={editorActions}/>
					</ActionsBarContainer>
					<ActionsBarTrigger
							isActionsVisible={isActionsVisible}
							onClick={() => {
								localStorage.setItem('isActionsVisible', JSON.stringify(true))
								setIsActionsVisible(true)
							}}
						>
							<TbChevronUp />
					</ActionsBarTrigger>
				</>
			)}
			<div className='note-informations'>
				{(fetchedNote?.id) && (
					<PopoverModal
						options={{ placement: 'top-start' }}
						triggerElement={{
							icon: TbInfoCircle,
							title: 'Informations'
						}}
					>
						{(fetchedNote?.created_by) && (createdBy?.first_name) && (
							<InformationContainer>
								<div>Created by</div>
								<div>
									<User
										firstName={createdBy?.first_name}
										lastName={createdBy.last_name}
										avatar={createdBy.avatar}
										size='md'
									/>
								</div>
							</InformationContainer>
						)}
						{(fetchedNote?.updated_by) && (updatedBy?.first_name) && (
							<InformationContainer>
								<div>Last edited by</div>
								<div>
									<User
										firstName={updatedBy?.first_name}
										lastName={updatedBy.last_name}
										avatar={updatedBy.avatar}
										size='md'
									/>
								</div>
							</InformationContainer>
						)}
						{(fetchedNote?.updated_at) && (
							<InformationContainer>
								<div>Last edited at</div>
								<div>
									{new Date(fetchedNote?.updated_at).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											weekday: 'long',
											day: 'numeric',
											hour: 'numeric',
											minute: 'numeric',
											hour12: false
										})}
								</div>
							</InformationContainer>
						)}
						{((fetchedNote?.shared_with && fetchedNote?.shared_with?.length > 0) && (
							<InformationContainer>
								<div>Shared with</div>
								<div>
									<User
										firstName={sharedWith?.first_name ?? ''}
										lastName={sharedWith?.last_name}
										avatar={sharedWith?.avatar}
										size='md'
									/>
								</div>
							</InformationContainer>
						))}
						{(fetchedNote?.public_note_id) && (
							<InformationContainer>
								<div>Public note</div>
								<div>
									<Button
										size='sm'
										href={`${window.location.origin}/note/${fetchedNote.public_note_id}`}
										target='_blank'
									>
										View <TbExternalLink />
									</Button>
									<Button
										size='sm'
										onClick={() => copyToClipboard({
											textToCopy: `${window.location.origin}/note/${fetchedNote.public_note_id}`,
											successMessage: 'Successfully copied the URL to clipboard!'
										})}
									>
										Copy URL <TbCopy />
									</Button>
								</div>
							</InformationContainer>
						)}
					</PopoverModal>
				)}
			</div>
			<div className='note-actions'>
				{(currentUser) && (
					<Button
						isDisabled={!(viewedNote?.title)}
						onClick={
							() => handleCreateOrUpdate(viewedNote)
							.then(() => setToast((viewedNote?.id) ? ToastTemplates.successNoteUpdate : ToastTemplates.successNoteCreate))
							.catch((error) => error)
						}
					>
						Save <TbDeviceFloppy />
					</Button>
				)}
			</div>
		</FormToolbar>
	)
}
//#endregion

//#region COLORS PICKER
//#region STYLES
const ColorPickerContainer = styled.div`
	padding: .4rem .8rem;
	gap: 1rem;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	transition: .2s;

	&:hover > div {
		opacity: .6;
		&:hover {
				opacity: 1;
			}
	}
`
const ColorContainer = styled.div<{ color: string, isSelected: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px; height: 24px;
	border: 1px solid var(--color-black-6);
	border-radius: 50%;
	background-color: ${({ color }) => color};
	cursor: pointer;
	transition: .2s;

	&:after {
		display: block;
		width: ${({ isSelected }) => isSelected ? '4px' : 0};
		height: ${({ isSelected }) => isSelected ? '4px' : 0};
		content: '';
		background-color: var(--color-white);
		border-radius: 50%;
		transition: .2s;
	}
`
//#endregion
const ColorPicker = () => {

	const viewedNote = useNoteStore((state) => state.viewedNote)
	const setViewedNote = useNoteStore((state) => state.setViewedNote)
	const colors = ['#3f6abf', '#FF674D', '#4DA167', 'transparent']

	const { mutateAsync: updateColor } = useUpdateMutation(
		supabase.from('notes'),
		['id'],
		`id, color`,
		{
			onSuccess: (updatedNote) => setViewedNote({ ...viewedNote, ...updatedNote })
		}
	)

	return (
		<ColorPickerContainer>
			{colors.map((color) => (
				<ColorContainer
					color={color}
					isSelected={color === viewedNote?.color}
					onClick={() => updateColor({ id: viewedNote?.id, color })}
				/>
			))}
		</ColorPickerContainer>
	)
}
//#endregion