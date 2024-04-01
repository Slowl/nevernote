import { styled } from '@linaria/react'
import { TbDotsVertical } from 'react-icons/tb'
import { IconType } from 'react-icons'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover'

//#region STYLES
const MenuListContainer = styled.div`
	min-width: 8rem;
`
const TriggerButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 22px;
	font-size: .8rem;
	padding: .1rem;
	border-radius: 50%;
	transition: .2s;

	&:hover {
		background-color: var(--color-black-5);
	}
`
const ActionButton = styled.div`
	padding: .4rem .8rem;
	font-size: .8rem;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	transition: .2s;
	&:hover {
		background-color: var(--color-black-2);
	}
`
//#endregion

const PopoverMenu = ({ list }: {
	list: {
		title: string;
		icon: IconType;
		event: () => void;
	}[];
}) => {

	return (
		<Popover placement='right-start'>
			<PopoverTrigger onClick={(event) => event.stopPropagation()}>
				<TriggerButton>
					<TbDotsVertical />
				</TriggerButton>
			</PopoverTrigger>
			<PopoverContent>
				<MenuListContainer>
					{list.map((action) => (
						<ActionButton onClick={(e) => { e.stopPropagation(), action.event() }} key={action.title}>
							<action.icon /> {action.title}
						</ActionButton>
					))}
				</MenuListContainer>
			</PopoverContent>
		</Popover>
	)
}

export default PopoverMenu