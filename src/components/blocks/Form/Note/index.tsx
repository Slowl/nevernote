import { memo, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { TbDeviceFloppy } from 'react-icons/tb'
import { styled } from '@linaria/react'
import { useInsertMutation, useQuery, useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { supabase } from '@/services/supabase'
import { getNote, getUser } from '@/utils/queries'
import { useGeneralStore, useNoteStore, useUserStore } from '@/store/index'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip'
import { ToastTemplates } from '@/components/ui/Toast'
import User from '@/components/ui/User'
import Editor from '@/components/ui/Editor'
import Loader from '@/components/ui/Loader'

//#region STYLES
const FormNoteContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 1rem .2rem;
	z-index: 0;
	@media screen and (max-width: 650px) {
		height: calc(100svh - 48px);
	}
`
const FormInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 100%;
	gap: .5rem 0;
	overflow-y: auto;
	scrollbar-color: var(--color-black-3) rgba(0,0,0,0);
	scrollbar-width: thin;

	@media screen and (max-width: 650px) {
		overflow-x: hidden;
	}
`
const FormHead = styled.div`
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
const FormBody = styled.div`
	display: flex;
	flex-grow: 1;
	height: 85svh; min-height: 20vh;
`
const FormToolbar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 90%;
	margin: auto;
	padding: .5rem 0;
	position: sticky;
	bottom: 0;
	border-top: 1px solid var(--color-black-4);

	.note-informations {
		display: flex;
		align-items: center;
		gap: .4rem;
		color: var(--color-grey-1);
		> div {
			font-size: .8rem;
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
	}

	@media screen and (max-width: 650px) {
		width: 95%;
		padding: .6rem .2rem .7rem;
		.note-informations {
			gap: .3rem;
			> div {
				font-size: .65rem;
			}
		}
		.note-actions {
			.button {
				padding: .5rem 1rem;
				font-size: .80rem;
				> svg {
					width: 14px; height: 14px;
				}
			}
		}
	}
`

//#endregion
const FormNote = memo(() => {

	//#region SETUP
	const { pathname } = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const viewedNoteId = searchParams.get('viewed')
	const viewedNote = useNoteStore((state) => state.viewedNote)
	const isNoteFormLoading = useNoteStore((state) => state.isNoteFormLoading)
	const setViewedNote = useNoteStore((state) => state.setViewedNote)
	const setTitle = useNoteStore((state) => state.setTitle)
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
	const { data: updatedBy } = useQuery(
		getUser({ userId: fetchedNote?.updated_by ?? '' }),
		{ enabled: !!(fetchedNote?.updated_by) }
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
			onSuccess: () => setToast(ToastTemplates.successNoteUpdate),
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
		async () => await handleCreateOrUpdate(viewedNote),
		{ preventDefault: true, enableOnFormTags: true, enableOnContentEditable: true },
		[viewedNote?.id, viewedNote?.title, viewedNote?.content]
	)
	//#endregion
	
	//#region EVENTS
	const handleCreateOrUpdate = async (note: typeof viewedNote) => {
		if (currentUser) {
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
							<FormHead>
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
							</FormHead>
							<FormBody>
								{
									((!(isNoteFormLoading) && (fetchedNote?.id)) || !(fetchedNote?.id)) && (
										<Editor
											configuration={{
												holder: 'note-editor',
												data: fetchedNote?.content,
												autofocus: false,
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
			<FormToolbar>
				<div className='note-informations'>
					{(fetchedNote?.updated_by) && (updatedBy?.first_name) && (
						<>
							<div>Last edited by</div>
							<User
								firstName={updatedBy?.first_name}
								lastName={updatedBy.last_name}
								avatar={updatedBy.avatar}
								size='md'
							/>
						</>
					)}
					<div>
						{(fetchedNote?.updated_at) && (
							<Tooltip placement='top'>
								<TooltipTrigger>
									{new Date(fetchedNote?.updated_at).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})
									}
								</TooltipTrigger>
								<TooltipContent>
									{new Date(fetchedNote?.updated_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										weekday: 'long',
										day: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
										hour12: false
									})}
								</TooltipContent>
							</Tooltip>
						)}
					</div>
				</div>
				<div className='note-actions'>
					{(currentUser) && (
						<div
							className='button'
							onClick={() => handleCreateOrUpdate(viewedNote)}
						>
							Save <TbDeviceFloppy />
						</div>
					)}
				</div>
			</FormToolbar>
		</FormNoteContainer>
	)
	//#endregion
})

export default FormNote