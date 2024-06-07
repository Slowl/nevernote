import { styled } from '@linaria/react'
import { IconType } from 'react-icons'

const ActionsBarContainer = styled.div`
	border: 1px solid red;
	min-width: 20rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: var(--color-black-1);
	border: 1px solid var(--color-black-3);
	border-radius: 25px;
	z-index: 1000;

	div {
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

		&:first-child {
			border-radius: 25px 0 0 25px;
		}
		&:last-child {
			border-radius: 0 25px 25px 0;
			border-right: 0px;
		}
		&:hover {
			background-color: var(--color-black-3);
		}

		> span {
			font-size: .75rem;
			color: var(--color-grey-1);
		}
	}
	
	@media screen and (max-width: 650px) {
		min-width: 17rem;
	}
`

export interface ActionsBarProps {
	readonly actions: {
		readonly label: string;
		readonly icon: IconType;
		readonly event: () => void;
	}[];
}

const ActionsBar = ({ actions }: ActionsBarProps) => {
	
	return (
		<ActionsBarContainer>
			{actions.map((action) => (
				<div onClick={action.event}>
					<span> {action.label} </span> <action.icon />
				</div>
			))}
		</ActionsBarContainer>
	)
}

export default ActionsBar