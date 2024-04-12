import { useEffect, useRef } from 'react'
import { styled } from '@linaria/react'
import { TbCircleCheck, TbExclamationCircle } from 'react-icons/tb'
import { ToastType } from '@/types/index'
import { useGeneralStore } from '@/store/index'

//#region STYLES
const ToastContainer = styled.div<{ isVisible: boolean, type: ToastType }>`
	position: fixed;
	top: ${({ isVisible }) => isVisible ? '15px' : '-100px'};
	right: 20px;
	display: flex;
	align-items: start;
	gap: .7rem;
	min-width: 17rem; width: 17rem;
	padding: .5rem .5rem .6rem;
	background-color: var(--color-green-0);
	color: var(--color-black-0);
	background-color: ${({ type }) => {
		switch (type) {
			case ToastType.SUCCESS: return 'var(--color-green-0)';
			case ToastType.ERROR: return 'var(--color-red-0)';
			case ToastType.WARNING: return 'var(--color-red-0)';
			default: return 'transparent'
		}
	}};
	color: ${({ type }) => {
		switch (type) {
			case ToastType.SUCCESS: return 'var(--color-black-0)';
			case ToastType.ERROR: return 'var(--color-white)';
			case ToastType.WARNING: return 'var(--color-white)';
			default: return 'var(--color-white)'
		}
	}};
	border-radius: 4px;
	transition: ease .3s;
	z-index: 1000;

	.icon {
		flex-shrink: 0;
		> svg {
			width: 24px; height: 24px;
		}
	}
	.content {
		font-size: .95rem;
	}

	@media screen and (max-width: 650px) {
		min-width: 85%; width: 85%;
		margin: auto;
		left: 0; right: 0	;
	}
`
//#endregion

const Toast = () => {

	const toast = useGeneralStore((state) => state.toast)
	const setToast = useGeneralStore((state) => state.setToast)
	const toastTimeout = useRef<NodeJS.Timeout>()

	useEffect(
		() => {
			if (toast?.isVisible) {
				toastTimeout.current = setTimeout(
					() => setToast({ ...toast, isVisible: false }),
					toast.duration ?? 3000
				)
			}		

			return () => toastTimeout.current && clearTimeout(toastTimeout.current)
		},
		[toast]
	)

	return (
		<ToastContainer
			isVisible={!!(toast?.isVisible)}
			type={toast?.type ?? ToastType.SUCCESS}
		>
			{toast?.icon && <div className='icon'> <toast.icon /> </div>}
			<div className='content'>
				{toast?.content} 
			</div>
		</ToastContainer>
	)
}

export default Toast

export const ToastTemplates = {
	successNoteCreate: {
		isVisible: true,
		content: 'Note successfully created!',
		type: ToastType.SUCCESS,
		icon: TbCircleCheck,
		duration: 3000,
	},
	successNoteUpdate: {
		isVisible: true,
		content: 'Note successfully updated!',
		type: ToastType.SUCCESS,
		icon: TbCircleCheck,
		duration: 3000,
	},
	successNoteDelete: {
		isVisible: true,
		content: 'Note successfully deleted!',
		type: ToastType.SUCCESS,
		icon: TbCircleCheck,
		duration: 3000,
	},
	successNoteArchived: {
		isVisible: true,
		content: 'Note successfully archived!',
		type: ToastType.SUCCESS,
		icon: TbCircleCheck,
		duration: 3000,
	},
	errorNote: {
		isVisible: true,
		content: 'An error occured...',
		type: ToastType.ERROR,
		icon: TbExclamationCircle,
		duration: 3000,
	}
}