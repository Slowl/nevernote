import { useEffect } from 'react'
import { styled } from '@linaria/react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { TbSettings, TbDeviceFloppy, TbPlus } from 'react-icons/tb'
import { useHotkeys } from 'react-hotkeys-hook'
import { supabase } from '@/services/supabase'
import { createNote, updateNote } from '@/utils/api'
import { useNoteStore, useUserStore } from '@/store/index'
import User from '@/components/ui/User'
import Editor from '@/components/ui/Editor'

//#region STYLES
const FormNoteContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 1rem .2rem;
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
			}

			&:hover {
				border-color: var(--color-black-3);
				background-color: var(--color-black-3);
			}
		}
	}
`
//#endregion
const FormNote = () => {

	//#region SETUP
	const { pathname } = useLocation()
	const [searchParams, _] = useSearchParams()
	const viewedNote = useNoteStore((state) => state.viewedNote)
	const isNoteFormLoading = useNoteStore((state) => state.isNoteFormLoading)
	const setViewedNote = useNoteStore((state) => state.setViewedNote)
	const setTitle = useNoteStore((state) => state.setTitle)
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const currentUserId = useUserStore((state) => state.currentUserId)
	const updatedBy = useUserStore((state) => state.updatedBy)
	const setUpdatedBy = useUserStore((state) => state.setUpdatedBy)
	//#endregion
	
	//#region CORE
	useEffect(
		() => {
			setIsNoteFormLoading(true)

			if (searchParams.get('viewed')) {
				getCurrentViewedNote(searchParams.get('viewed')!)
					.then((currentNote) => {
						currentNote && setViewedNote(currentNote)
						return currentNote
					})
					.then((currentNote) => {
						if (currentNote?.updated_by) {
							getUpdatedByUser(currentNote.updated_by)
								.then((user) => user && setUpdatedBy(user))
						}
					})
				.finally(() => setIsNoteFormLoading(false))
			} else {
				setTitle('')
				setViewedNote({ title: '', content: {
						blocks: [],
						time: 1712106748497,
						version: '2.29.1'
					}
				})
				setIsNoteFormLoading(false)
			}

			() => { setIsNoteFormLoading(false) }
		},
		[searchParams.get('viewed'), pathname],
	)

	useHotkeys(
		['meta+s', 'ctrl+s'],
		() => handleCreateOrUpdate(viewedNote),
		{ preventDefault: true, enableOnFormTags: true, enableOnContentEditable: true },
		[viewedNote?.id, viewedNote?.title, viewedNote?.content]
	)
	//#endregion
	
	//#region EVENTS
	const getCurrentViewedNote = async (noteId: string) => {
		const { data } = await supabase.from('notes')
			.select()
			.eq('id', noteId)
			.limit(1)

		return data && data[0]
	}

	const getUpdatedByUser = async (userId: string) => {
		const { data } = await supabase.from('profiles')
			.select()
			.eq('id', userId)
			.limit(1)
		
		return data && data[0]
	}

	const handleCreateOrUpdate = async (note: typeof viewedNote) => {
		if (currentUserId) {
			if (note?.id) {
				await updateNote({
					id: note.id,
					title: note.title ?? '',
					content: note.content,
					updated_by: currentUserId,
				})
			} else {
				await createNote({
					title: note?.title ?? '',
					content: note?.content,
					created_by: currentUserId,
				})
			}
		}
	}
	//#endregion

	//#region RENDER
	return (
		<FormNoteContainer>
			<FormInputContainer>
				<FormHead>
					<input
						type='text'
						placeholder={`Write your note's title ...`}
						onChange={(event => setTitle(event.target.value))} value={viewedNote?.title ?? ''}
					/>
					<div className='action-container'>
						<div className='action-button'>
							<TbSettings />
						</div>
					</div>
				</FormHead>
				<FormBody>
					{!(isNoteFormLoading) && (
						<Editor
							configuration={{
								holder: 'note-editor',
								data: viewedNote?.content,
								autofocus: false,
								placeholder: 'Write your note...',
							}}
						/>
					)}
				</FormBody>
			</FormInputContainer>
			<FormToolbar>
				<div className='note-informations'>
					{(viewedNote?.updated_by) && (updatedBy?.first_name) && (
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
					<div>{(viewedNote?.updated_at) && (
						' - ' + new Date(viewedNote?.updated_at).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							hour12: false
						})
					)}
					</div>
				</div>
				<div className='note-actions'>
					{(currentUserId) && (
						<div
							className='button'
							onClick={() => handleCreateOrUpdate(viewedNote)}
						>
							{(viewedNote?.id) ? 'Update' : 'Create'} {(viewedNote?.id) ? <TbDeviceFloppy /> : <TbPlus />}
						</div>
					)}
				</div>
			</FormToolbar>
		</FormNoteContainer>
	)
	//#endregion
}

export default FormNote