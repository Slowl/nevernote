import { ReactNode } from 'react'
import { styled } from '@linaria/react'
import { IconType } from 'react-icons'
import { Popover, PopoverContent, PopoverOptions, PopoverTrigger } from '@/components/ui/Popover'

const ActionsBarContainer = styled.div`
	min-width: 25rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: var(--color-black-1);
	border: 1px solid var(--color-black-3);
	border-radius: 25px;
	z-index: 1000;

	> div {
		&:first-child {
			border-radius: 25px 0 0 25px;
		}
		&:last-child {
			border-radius: 0 25px 25px 0;
			border-right: 0px;
		}
	}
	
	@media screen and (max-width: 650px) {
		min-width: 17rem;
	}
`

const ActionTrigger = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	background-color: var(--color-black-1);
	border-right: 1px solid var(--color-black-2);
	width: 100%;
	padding: .5rem .7rem;
	cursor: pointer;
	user-select: none;
	transition: .2s;
	
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}
	span {
		font-size: .75rem;
		color: var(--color-grey-1);
	}
	svg { flex-shrink: 0; }

	&:hover {
		background-color: var(--color-black-3);
	}
`

export interface ActionsBarProps {
	readonly actions: {
		readonly label: string;
		readonly icon: IconType;
		readonly event?: () => void;
		readonly popover?: {
			readonly content: ReactNode;
			readonly options?: PopoverOptions;
		}
	}[];
}

const ActionsBar = ({ actions }: ActionsBarProps) => {
	
	return (
		<ActionsBarContainer>
			{actions.map((action) => (
				action.popover?.content
				? (
					<ActionTrigger key={action.label}>
						<Popover {...action.popover?.options}>
							<PopoverTrigger>
								<span> {action.label} </span> <action.icon />
							</PopoverTrigger>
							<PopoverContent>
								{action.popover.content}
							</PopoverContent>
						</Popover>
					</ActionTrigger>
				)
				: (
					<ActionTrigger key={action.label} onClick={action.event}>
						<span> {action.label} </span> <action.icon />
					</ActionTrigger>
				)
			))}
		</ActionsBarContainer>
	)
}

export default ActionsBar