import { styled } from '@linaria/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useInsertMutation, useDeleteMutation, useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { TbUsers, TbEyeShare, TbEyeCheck, TbEyeOff, TbBookmark, TbBookmarkFilled, TbArchive, TbArchiveOff, TbTrash, TbCheck, TbX, TbDotsVertical, TbPin, TbPinnedOff, TbPinned } from 'react-icons/tb'
import Output from 'editorjs-react-renderer'
import { supabase } from '@/services/supabase'
import { useGeneralStore, useNoteStore, useUserStore } from '@/store/index'
import type { Tables } from '@/types/database'
import { ToastTemplates } from '@/components/ui/Toast'
import PopoverMenu from '@/components/ui/PopoverMenu'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip'
import User from '@/components/ui/User'
import { memo } from 'react'

//#region STYLES
const NoteCardContainer = styled.div<{ isViewed: boolean, selectedColor?: string | null }>`
	display: flex;
	flex-direction: column;
	position: relative;
	width: 95%; max-height: 7.5rem;
	margin: auto;
	gap: .3rem 0;
	padding: .5rem;
	background-color: var(--color-black-2);
	border: 1px solid ${({ isViewed }) => isViewed ? 'var(--color-grey-2)' : 'var(--color-black-6)'};
	border-radius: 8px;
	cursor: pointer;
	opacity: 1;
	translate: 0px 0px;
	transition:
		border .2s,
		transform .2s,
		opacity .35s,
		translate .35s
	;

	&:before {
		content: '';
		display: block;
		position: absolute;
		width: 15px; height: 15px;
		border-radius: 50%;
		background-color: ${({ selectedColor }) => selectedColor ? selectedColor : ''};
		top: -6px;
		left: -6px;
		transition: .3s;
	}

	@starting-style {
		opacity: 0;
		translate: 0 -10px;
	}
	
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
				&::after {
					display: block;
					width: 100%; height: 100%;
					position: absolute;
					top: 0;
					content: '';
					background-color: transparent;
					z-index: 1000;
				}
				position: relative;
				padding-top: 5px;
				color: var(--color-grey-1);
				font-size: .78rem;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;  
				overflow: hidden;
				line-height: 1rem;
				z-index: 0;
				ul, ol {
					line-height: 1rem;
					margin: 0;
					padding-left: 15px;
				}
				input[type='checkbox'] {
					margin: 0px 10px 7px 0;
					width: 14px !important; height: 14px !important;
				}
				a {
					color: #0083db;
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
			width: 27px; height: 27px;
			& svg {
				width: 16px; height: 16px;
			}
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
const PinContainer = styled.div<{ isPinned: boolean }>`
	width: 15px;
	position: absolute;
	left: 46%; top: -10px;
	color: var(--color-white);
	visibility: ${({ isPinned }) => isPinned ? 'visible' : 'hidden'};
	opacity: ${({ isPinned }) => isPinned ? 1 : 0};
	translate: ${({ isPinned }) => isPinned ? '0px 0px': '0px -5px'};
	transition: .3s;
	svg { fill: var(--color-black-1); }
`
//#endregion

interface NoteCardProps {
	note: Pick<
		Tables<'notes'>, 'id' | 'created_by' | 'title' | 'content' | 'is_archived' | 'is_bookmarked' | 'public_note_id' | 'shared_with' | 'color' | 'pinned'
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
	const { mutateAsync: pinNote } = useUpdateMutation(
		supabase.from('notes'),
		['id'],
		`id, pinned`,
		{
			onSuccess: (pinnedNote) => setToast({
				...ToastTemplates.sucessDefault,
				content: pinnedNote?.pinned ? 'Note successfully pinned' : 'Note unpinned'
			}),
			onError: (error) => {
				setToast({
					...ToastTemplates.errorNote,
					content: viewedNote?.is_archived ? 'Error while pinning the note...' : 'Error while pinning...'
				})
				console.error('Error while pinning the note: ', error)
				throw new Error(`Error while pinning the note: ${error}`)
			}
		}
	)
	const { mutateAsync: bookmarkNote } = useUpdateMutation(
		supabase.from('notes'),
		['id'],
		`id, is_bookmarked, updated_by`,
		{
			onSuccess: (bookmarkedNote) => setToast({
				...ToastTemplates.successNoteArchived,
				content: bookmarkedNote?.is_bookmarked ? 'Note successfully bookmarked' : 'Note removed from bookmarks'
			}),
			onError: (error) => {
				setToast({
					...ToastTemplates.errorNote,
					content: viewedNote?.is_bookmarked ? 'Error while removing from bookmarks...' : 'Error while bookmarking...'
				})
				console.error('Error while adding/removing from bookmarks: ', error)
				throw new Error(`Error while adding/removing from bookmarks: ${error}`)
			}
		}
	)
	const { mutateAsync: archiveNote } = useUpdateMutation(
		supabase.from('notes'),
		['id'],
		`id, is_archived, updated_by`,
		{
			onSuccess: (archivedNote) => setToast({
				...ToastTemplates.successNoteArchived,
				content: archivedNote?.is_archived ? 'Note successfully archived' : 'Note removed from archives'
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
	const { mutateAsync: addPublicNoteId } = useUpdateMutation(
		supabase.from('notes'),
		['id'],
		`id, public_note_id`,
		{
			onError: (error) => {
				setToast({
					...ToastTemplates.errorNote,
					content: 'Error while adding public note id...'
				})
				console.error('Error while adding public note id: ', error)
				throw new Error(`Error while adding public note id: ${error}`)
			}
		}
	)
	const { mutateAsync: createPublicNote } = useInsertMutation(
		supabase.from('public_notes'),
		['id'],
		`id, created_by, related_note`,
		{
			onSuccess: async (createdPublicNote) => {
				await addPublicNoteId({
					id: note.id,
					public_note_id: createdPublicNote?.[0].id,
				})
				await navigator.clipboard.writeText(`${window.location.origin}/note/${createdPublicNote?.[0].id}`)
				setToast({
					...ToastTemplates.successNoteCreate,
					content: 'The note has successfully been published! URL copied to your clipboard',
					duration: 3000,
				})
			},
			onError: (error) => {
				setToast({
					...ToastTemplates.errorNote,
					content: 'Error while creating a public note...'
				})
				console.error('Error while creating a public note: ', error)
				throw new Error(`Error while creating a public note: ${error}`)
			}
		}
	)
	const { mutateAsync: deletePublicNote } = useDeleteMutation(
		supabase.from('public_notes'),
		['id'],
		`id`,
		{
			onSuccess: () => {
				setToast({
					...ToastTemplates.successNoteDelete,
					content: 'Note successfully removed from public'
				})
			},
			onError: (error) => {
				setToast({ ...ToastTemplates.errorNote, content: 'Could not remove the note from public...' })
				console.error('Error while removing a note from public: ', error)
				throw new Error(`Error while removing a note from public: ${error}`)
			}
		}
	)
	//#endregion

	//#region EVENTS
	const menuList = [
		{
			title: note.pinned ? 'Unpin the note' : 'Pin the note',
			icon: note.pinned ? TbPinnedOff : TbPinned,
			event: () => note.pinned
				? pinNote({ id: note.id, pinned: false })
				: pinNote({ id: note.id, pinned: true }),
		},
		{
			title: note.is_bookmarked ? 'Remove from bookmarks' : 'Bookmark',
			icon: note.is_bookmarked ? TbBookmarkFilled : TbBookmark,
			event: () => currentUserId && bookmarkNote({
				id: note.id,
				is_bookmarked: !(note.is_bookmarked),
				updated_by: currentUserId,
			}),
		},
		{
			title: note.public_note_id ? 'Remove from public' : 'Publish publicly',
			icon: note.public_note_id ? TbEyeOff : TbEyeShare,
			event: () => note.public_note_id
				? deletePublicNote({ id: note.public_note_id, created_by: currentUserId })
				: createPublicNote([{ created_by: currentUserId, related_note: note.id }]),
		},
		{
			title: note.is_archived ? 'Remove from archive' : 'Archive',
			icon: note.is_archived ? TbArchiveOff : TbArchive,
			event: () => currentUserId && archiveNote({
				id: note.id,
				is_archived: !(note.is_archived),
				updated_by: currentUserId,
			}),
		},
		{
			title: 'Delete',
			icon: TbTrash,
			event: () => deleteNote({ id: note.id }),
			withConfirmation: true,
		},
		// {
		// 	title: 'Settings',
		// 	icon: TbSettings,
		// 	event: () => console.log('coming soon...')
		// }
	]
	//#endregion

	//#region RENDER
	const ListRenderer = ({ data }: {
		data: {
			style: 'checklist' | 'unordered' | 'ordered';
			items: { content: string; meta?: { checked: boolean }; }[];
		};
	}) => {
		switch (data.style) {
			case 'checklist': return (
				data.items.map((checklistItem, index) => (
					<div key={index}>
						<input readOnly type='checkbox' id={`checklist-item-${index}`} name={checklistItem.content} checked={checklistItem.meta?.checked} />
						<label htmlFor={`checklist-item-${index}`}>{checklistItem.content}</label>
					</div>
				))
			)
			case 'unordered': return (
				<ul>
					{data.items.map((unorderedItem, index) => (
						<li key={index}> {unorderedItem.content} </li>
					))}
				</ul>
			)
			case 'ordered': return (
				<ol>
					{data.items.map((orderedItem, index) => (
						<li key={index}> {orderedItem.content} </li>
					))}
				</ol>
			)
		}
	}

	const CustomRenderers = {
		list: ListRenderer,
	}

	return (
		<NoteCardContainer
			onClick={onClick}
			isViewed={viewedNote?.id === note.id}
			selectedColor={note.color}
			key={note.id}
		>
			<PinContainer isPinned={note.pinned}> <TbPin /> </PinContainer>
			<div className='main-container'>
				<div className='content-container'>
					<div className='title'> {(note.title.length > 30) ? `${note.title.slice(0, 30)}…` : note.title} </div>
					<div className='content-preview'> <Output renderers={CustomRenderers} data={note.content ?? ''} /> </div>
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
							<TbEyeCheck style={{ color: note.public_note_id ? 'var(--color-green-0)' : 'var(--color-grey-2)' }} />
						</TooltipTrigger>
						<TooltipContent>
							{note.public_note_id
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