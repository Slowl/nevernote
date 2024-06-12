import { ReactNode, useState } from 'react'
import { styled } from '@linaria/react'
import { IconType } from 'react-icons'
import { Popover, PopoverTrigger, PopoverContent, PopoverOptions } from '@/components/ui/Popover'

//#region STYLES
const MenuListContainer = styled.div`
	min-width: 8rem;
	> :first-child  {
		border-radius: 4px 4px 0 0;
	}
	> :last-child {
		border-radius: 0 0 4px 4px;
	}
	@media screen and (max-width: 650px) {
		min-width: 10rem;
	}
`
const TriggerButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 22px; height: 22px;
	padding: .1rem;
	font-size: .8rem;
	border-radius: 50%;
	transition: .2s;

	&:hover {
		background-color: var(--color-black-5);
	}
`
const ActionButton = styled.div<{ isInConfirmState: boolean }>`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: .4rem .8rem;
	font-size: .8rem;
	cursor: pointer;
	transition: .2s;
	background-color: ${({ isInConfirmState }) => isInConfirmState ? 'var(--color-red-0)' : 'var(--color-black-0)'};

	&:hover {
		background-color: ${({ isInConfirmState }) => isInConfirmState ? 'var(--color-red-0)' : 'var(--color-black-2)'};
	}
	@media screen and (max-width: 650px) {
		padding: .7rem 1rem;
		font-size: .9rem;
	}
`
//#endregion

interface PopoverMenuProps {
	children: ReactNode;
	list: {
		title: string;
		icon: IconType;
		event: () => void;
		withConfirmation?: boolean;
	}[];
	options: PopoverOptions;
}

const PopoverMenu = ({ children, list, options }: PopoverMenuProps) => {

	const [confirmation, setConfirmation] = useState({
		for: '',
		isSet: false,
	})

	const handleClickEvent = ({ clickEvent, action }: {
		clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
		action: PopoverMenuProps['list'][number],
	}) => {
		let resetTimeout
		clickEvent.stopPropagation()
		if ((action.withConfirmation && !(confirmation.isSet))) {
			setConfirmation({ for: action.title, isSet: true })
			resetTimeout = setTimeout(() => setConfirmation({ for: '', isSet: false }), 5000)
		} else {
			setConfirmation({ for: '', isSet: false })
			action.event()
			clearTimeout(resetTimeout)
		}
	}

	return (
		<Popover {...options}>
			<PopoverTrigger onClick={(event) => event.stopPropagation()}>
				<TriggerButton>
					{children}
				</TriggerButton>
			</PopoverTrigger>
			<PopoverContent>
				<MenuListContainer>
					{list.map((action) => (
						<ActionButton
							isInConfirmState={((confirmation.for === action.title) && confirmation.isSet)}
							onClick={(event) => handleClickEvent({ clickEvent: event, action })}
							key={action.title}
						>
							<action.icon />
							{((confirmation.for === action.title) && confirmation.isSet) ? 'Click to confirm' : action.title}
						</ActionButton>
					))}
				</MenuListContainer>
			</PopoverContent>
		</Popover>
	)
}

export default PopoverMenu