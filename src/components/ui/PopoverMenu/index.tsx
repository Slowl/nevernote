import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover'
import { styled } from '@linaria/react'
import { IconType } from 'react-icons'
import { TbDotsVertical } from 'react-icons/tb'

//#region STYLES
const MenuListContainer = styled.div`
	width: 8rem;
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
				<TbDotsVertical />
			</PopoverTrigger>
			<PopoverContent>
				<MenuListContainer>
					{list.map((action) => (
						<ActionButton onClick={action.event} key={action.title}>
							<action.icon /> {action.title}
						</ActionButton>
					))}
				</MenuListContainer>
			</PopoverContent>
		</Popover>
	)
}

export default PopoverMenu