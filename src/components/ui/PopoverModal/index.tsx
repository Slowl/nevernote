import type { ReactNode } from 'react'
import { styled } from '@linaria/react'
import type { IconType } from 'react-icons'
import { Popover, PopoverTrigger, PopoverContent, type PopoverOptions } from '@/components/ui/Popover'

//#region STYLES
const TriggerButton = styled.div`
	display: flex;
	align-items: center;
	gap: 0 .3rem;
	cursor: pointer;
	user-select: none;
	&:hover {
		text-decoration: underline;
	}
`
const ContentContainer = styled.div`
	background-color: var(--color-black-2);
	padding: .5rem .8rem;
	font-size: .8rem;
	width: 23rem;

	@media screen and (max-width: 650px) {
		width: 21rem;
	}
`
//#endregion

interface PopoverModalProps {
	children: ReactNode;
	triggerElement: {
		icon: IconType;
		title?: string;
	}
	options: PopoverOptions;
}

const PopoverModal = ({ children, triggerElement, options }: PopoverModalProps) => {

	return (
		<Popover {...options}>
			<PopoverTrigger onClick={(event) => event.stopPropagation()}>
				<TriggerButton>
					<triggerElement.icon /> {triggerElement.title}
				</TriggerButton>
			</PopoverTrigger>
			<PopoverContent>
				<ContentContainer>
					{children}
				</ContentContainer>
			</PopoverContent>
		</Popover>
	)
}

export default PopoverModal