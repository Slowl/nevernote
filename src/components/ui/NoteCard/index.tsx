import { styled } from '@linaria/react'
import { Tables } from '@/types/database'
import { TbUsers, TbEyeShare, TbDotsVertical, TbCheck, TbX } from 'react-icons/tb'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip'
import User from '@/components/ui/User'
import { useNoteStore } from '@/store/index'

//#region STYLES
const NoteCardContainer = styled.div<{ isViewed: boolean }>`
	display: flex;
	flex-direction: column;
	gap: .3rem 0;
	padding: .5rem;
	background-color: var(--color-black-2);
	border: 1px solid ${({ isViewed }) => isViewed ? 'var(--color-grey-3)' : 'var(--color-black-4)'};
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
			.title {
				font-size: .85rem;
				font-weight: bold;
			}
			.content-preview {
				color: var(--color-grey-1);
				font-size: .78rem;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;  
				overflow: hidden;
			}
		}

		.action-container {
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			align-items: center;

			.action-button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 22px;
				height: 22px;
				font-size: .8rem;
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
		border: 1px solid var(--color-grey-3);
		transform: translateY(-2px);

		& > .main-container > .action-container > .action-button {
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
	note: Pick<Tables<'notes'>, 'id' | 'title' | 'content' | 'public_url' | 'shared_with'> & { profiles?: Tables<'profiles'> };
	onClick: () => void;
}

const NoteCard = ({ note, onClick }: {
	note: NoteCardProps['note'],
	onClick: NoteCardProps['onClick']
}) => {

	const viewedNote = useNoteStore((state) => state.note)

	return (
		<NoteCardContainer onClick={onClick} isViewed={viewedNote?.id === note.id}>
			<div className='main-container'>
				<div className='content-container'>
					<div className='title'> {note.title} </div>
					<div className='content-preview'> {note.content as string} </div>
				</div>
				<div className='action-container'>
					<div className='action-button'>
						<TbDotsVertical />
					</div>
				</div>
			</div>
			<div className='information-container'>
				<div className='author'>
					{note.profiles && (
						<>
							by:
							<User
								firstName={note.profiles?.first_name ?? ''}
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
								? <StatusTootip> <TbCheck style={{ color: '#3eca57' }} /> <span>shared</span> </StatusTootip>
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
								? <StatusTootip> <TbCheck style={{ color: '#3eca57' }} /> <span>publicly available</span> </StatusTootip>
								: <StatusTootip> <TbX style={{ color: '#ca3e3e' }}/> not published </StatusTootip>
							}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</NoteCardContainer>
	)
}

export default NoteCard