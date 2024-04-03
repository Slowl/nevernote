import { styled } from '@linaria/react'
import { IconType } from 'react-icons'
import { TbDotsVertical } from 'react-icons/tb'
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
const ActionButton = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: .4rem .8rem;
	font-size: .8rem;
	cursor: pointer;
	transition: .2s;

	&:hover {
		background-color: var(--color-black-2);
	}
`
//#endregion

interface PopoverMenuProps {
	list: {
		title: string;
		icon: IconType;
		event: () => void;
	}[];
	options: PopoverOptions
}

const PopoverMenu = ({ list, options }: PopoverMenuProps) => {

	return (
		<Popover {...options}>
			<PopoverTrigger onClick={(event) => event.stopPropagation()}>
				<TriggerButton>
					<TbDotsVertical />
				</TriggerButton>
			</PopoverTrigger>
			<PopoverContent>
				<MenuListContainer>
					{list.map((action) => (
						<ActionButton onClick={(event) => { event.stopPropagation(), action.event() }} key={action.title}>
							<action.icon /> {action.title}
						</ActionButton>
					))}
				</MenuListContainer>
			</PopoverContent>
		</Popover>
	)
}

export default PopoverMenu