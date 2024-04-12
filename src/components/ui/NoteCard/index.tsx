import { memo } from 'react'
import { styled } from '@linaria/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeleteMutation, useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { TbUsers, TbEyeShare, TbArchive, TbTrash, TbSettings, TbCheck, TbX, TbDotsVertical } from 'react-icons/tb'
import Output from 'editorjs-react-renderer'
import { supabase } from '@/services/supabase'
import { useGeneralStore, useNoteStore, useUserStore } from '@/store/index'
import { Tables } from '@/types/database'
import { ToastTemplates } from '@/components/ui/Toast'
import PopoverMenu from '@/components/ui/PopoverMenu'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip'
import User from '@/components/ui/User'

//#region STYLES
const NoteCardContainer = styled.div<{ isViewed: boolean }>`
	display: flex;
	flex-direction: column;
	width: 95%; max-height: 7.5rem;
	margin: auto;
	gap: .3rem 0;
	padding: .5rem;
	background-color: var(--color-black-2);
	border: 1px solid ${({ isViewed }) => isViewed ? 'var(--color-grey-2)' : 'var(--color-black-6)'};
	border-radius: 8px;
	cursor: pointer;
	transition: .2s;
	
	.main-container {
		display: flex;
		gap: 0 1rem;
		min-height: 4rem;
		border-bottom: 1px solid var(--color-black-3);

		.content-container {
			flex-grow: 1;
			overflow-y: hidden;
			padding-bottom: 10px;
			.title {
				font-size: .85rem;
				font-weight: bold;
			}
			.content-preview {
				position: relative;
				&::after {
					display: block;
					width: 100%; height: 100%;
					position: absolute;
					top: 0;
					content: '';
					background-color: transparent;
					z-index: 1000;
				}
				color: var(--color-grey-1);
				font-size: .78rem;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;  
				overflow: hidden;
				line-height: 1rem;
				z-index: 0;
				ul {
					line-height: 1rem;
					margin: 0;
				}
				input[type='checkbox'] {
					width: 14px !important; height: 14px !important;
				}
			}
		}

		.action-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			flex-shrink: 0;

			.action-button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 22px; height: 22px;
				padding: .1rem;
				border-radius: 50%;
				font-size: .8rem;
				visibility: hidden;
				opacity: 0;
				transition: .2s;

				&:hover {
					background-color: var(--color-black-5);
				}
			}
		}
	}

	.information-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: .1rem 0;
		font-size: .6rem;

		.author {
			display: flex;
			align-items: center;
			gap: 6px;
		}

		.status-icons {
			display: flex;
			align-items: center;
			gap: .3rem;
			font-size: .8rem;
		}
	}

	&:hover {
		border: 1px solid var(--color-grey-2);
		transform: translateY(-2px);

		& > .main-container > .action-container > .action-button {
			visibility: visible;
			opacity: 1;
		}
	}

	@media screen and (max-width: 650px) {
		.main-container > .action-container > .action-button {
			visibility: visible;
			opacity: 1;
		}
	}
`
const StatusTootip = styled.div`
	display: flex;
	align-items: center;
	gap: 0 3px;
	font-size: .6rem;
	> svg {
		width: 10px; height: 10px;
	}
`
//#endregion

interface NoteCardProps {
	note: Pick<
		Tables<'notes'>, 'id' | 'created_by' | 'title' | 'content' | 'is_archived' | 'public_url' | 'shared_with'
	> & { profiles?: Tables<'profiles'> };
	onClick: () => void;
}

const NoteCard = memo(({ note, onClick }: NoteCardProps) => {

	//#region SETUP
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const viewedNote = useNoteStore((state) => state.viewedNote)
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const currentUserId = useUserStore((state) => state.currentUserId)
	const setToast = useGeneralStore((state) => state.setToast)
	//#endregion

	//#region CORE
	const { mutateAsync: updateNote } = useUpdateMutation(
		supabase.from('notes'),
		['id'],
		`id, is_archived, updated_by`,
		{
			onSuccess: (updatedNote) => setToast({
				...ToastTemplates.successNoteArchived,
				content: updatedNote?.is_archived ? 'Note successfully archived' : 'Note removed from archives'
			}),
			onError: (error) => {
				setToast({
					...ToastTemplates.errorNote,
					content: viewedNote?.is_archived ? 'Error while removing from archives...' : 'Error while archiving...'
				})
				console.error('Error while archiving/removing from archives: ', error)
				throw new Error(`Error while archiving/removing from archives: ${error}`)
			}
		}
	)
	const { mutateAsync: deleteNote } = useDeleteMutation(
		supabase.from('notes'),
		['id'],
		`id`,
		{
			onSuccess: () => {
				navigate(pathname)
				setIsNoteFormLoading(true)
				setToast(ToastTemplates.successNoteDelete)
			},
			onError: (error) => {
				setToast({ ...ToastTemplates.errorNote, content: 'Could not delete the note...' })
				console.error('Error while deleting a note: ', error)
				throw new Error(`Error while deleting a note: ${error}`)
			}
		}
	)
	//#endregion

	//#region EVENTS
	const menuList = [
		{
			title: note.is_archived ? 'Remove from archive' : 'Archive',
			icon: TbArchive,
			event: () => currentUserId && updateNote({
				id: note.id,
				is_archived: !(note.is_archived),
				updated_by: currentUserId,
			})
		},
		{
			title: 'Delete',
			icon: TbTrash,
			event: () => deleteNote({ id: note.id })
		},
		{
			title: 'Settings',
			icon: TbSettings,
			event: () => console.log('coming soon...')
		}
	]
	//#endregion

	//#region RENDER
	return (
		<NoteCardContainer onClick={onClick} isViewed={viewedNote?.id === note.id} key={note.id}>
			<div className='main-container'>
				<div className='content-container'>
					<div className='title'> {(note.title.length > 30) ? `${note.title.slice(0, 30)}…` : note.title} </div>
					<div className='content-preview'> <Output data={note.content} /> </div>
				</div>
				{(note.created_by === currentUserId) && (
					<div className='action-container'>
						<div className='action-button'>
							<PopoverMenu list={menuList} options={{ placement: 'right-start' }}>
								<TbDotsVertical />
							</PopoverMenu>
						</div>
					</div>
				)}
			</div>
			<div className='information-container'>
				<div className='author'>
					{(note.profiles && note.profiles.first_name) && (
						<>
							by:
							<User
								firstName={note.profiles?.first_name}
								lastName={note.profiles?.last_name}
								avatar={note.profiles?.avatar}
							/>
						</>
					)}
				</div>
				<div className='status-icons'>
					<Tooltip placement='bottom'>
						<TooltipTrigger>
							<TbUsers style={{ color: note.shared_with ? 'var(--color-green-0)' : 'var(--color-grey-2)' }} />
						</TooltipTrigger>
						<TooltipContent>
							{note.shared_with
								? <StatusTootip> <TbCheck style={{ color: '#3eca57' }} /> <span> shared </span> </StatusTootip>
								: <StatusTootip> <TbX style={{ color: '#ca3e3e' }}/> not shared </StatusTootip>
							}
						</TooltipContent>
					</Tooltip>
					<Tooltip placement='bottom'>
						<TooltipTrigger>
							<TbEyeShare style={{ color: note.public_url ? 'var(--color-green-0)' : 'var(--color-grey-2)' }} />
						</TooltipTrigger>
						<TooltipContent>
							{note.public_url
								? <StatusTootip> <TbCheck style={{ color: '#3eca57' }} /> <span> publicly available </span> </StatusTootip>
								: <StatusTootip> <TbX style={{ color: '#ca3e3e' }}/> not published </StatusTootip>
							}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</NoteCardContainer>
	)
	//#endregion
})

export default NoteCard