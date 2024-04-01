import {
	useState,
	useMemo,
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	ReactNode,
	forwardRef,
	HTMLProps,
	isValidElement,
	cloneElement,
	useLayoutEffect,
	ButtonHTMLAttributes
} from 'react'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useClick,
	useDismiss,
	useRole,
	useInteractions,
	useMergeRefs,
	Placement,
	FloatingPortal,
	FloatingFocusManager,
	useId
} from '@floating-ui/react'
import { styled } from '@linaria/react'

//#region HOOKS & TYPES
interface PopoverOptions {
	initialOpen?: boolean;
	placement?: Placement;
	modal?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const usePopover = ({
	initialOpen = false,
	placement = 'bottom',
	modal,
	open: controlledOpen,
	onOpenChange: setControlledOpen
}: PopoverOptions = {}) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)
	const [labelId, setLabelId] = useState<string | undefined>()
	const [descriptionId, setDescriptionId] = useState<
		string | undefined
	>()

	const open = controlledOpen ?? uncontrolledOpen
	const setOpen = setControlledOpen ?? setUncontrolledOpen

	const data = useFloating({
		placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(12),
			flip({
				crossAxis: placement.includes('-'),
				fallbackAxisSideDirection: 'end',
				padding: 12
			}),
			shift({ padding: 12 })
		]
	})

	const context = data.context

	const click = useClick(context, {
		enabled: controlledOpen == null
	})
	const dismiss = useDismiss(context)
	const role = useRole(context)

	const interactions = useInteractions([click, dismiss, role])

	return useMemo(
		() => ({
			open,
			setOpen,
			...interactions,
			...data,
			modal,
			labelId,
			descriptionId,
			setLabelId,
			setDescriptionId
		}),
		[open, setOpen, interactions, data, modal, labelId, descriptionId]
	)
}

type ContextType =
	| (ReturnType<typeof usePopover> & {
			setLabelId: Dispatch<SetStateAction<string | undefined>>;
			setDescriptionId: Dispatch<
				SetStateAction<string | undefined>
			>;
		})
	| null;

const PopoverContext = createContext<ContextType>(null)

export const usePopoverContext = () => {
	const context = useContext(PopoverContext)

	if (context == null) {
		throw new Error('Popover components must be wrapped in <Popover />')
	}

	return context
}
//#endregion

//#region POPOVER
export const Popover = ({
	children,
	modal = false,
	...restOptions
}: {
	children: ReactNode
} & PopoverOptions) => {

	const popover = usePopover({ modal, ...restOptions })
	return (
		<PopoverContext.Provider value={popover}>
			{children}
		</PopoverContext.Provider>
	)
}
//#endregion

//#region POPOVER TRIGGER
interface PopoverTriggerProps {
	children: ReactNode;
	asChild?: boolean;
}

export const PopoverTrigger = forwardRef<
	HTMLElement,
	HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
	const context = usePopoverContext()
	const childrenRef = (children as any).ref
	const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

	if (asChild && isValidElement(children)) {
		return cloneElement(
			children,
			context.getReferenceProps({
				ref,
				...props,
				...children.props,
				'data-state': context.open ? 'open' : 'closed'
			})
		)
	}

	return (
		<div
			ref={ref}
			data-state={context.open ? 'open' : 'closed'}
			{...context.getReferenceProps(props)}
		>
			{children}
		</div>
	)
})
//#endregion

//#region POPOVER CONTENT
const PopoverContentContainer = styled.div`
	color: #dddddd;
	background-color: #1e1e1e;
	border: 1px solid #2e2e2e;
	border-radius: 4px;
	position: relative;

	&:focus-visible {
		outline: none;
	}
	&::after {
		content: '';
		display: block;
		background-color: #2e2e2e;
		width: 4px;
		height: 2px;
		position: absolute;
		left: -4px;
		top: 3px;
		transform: rotate(135deg);
	}
	&::before {
		content: '';
		display: block;
		background-color: #2e2e2e	;
		width: 4px;
		height: 2px;
		position: absolute;
		left: -4px;
		top: 4px;
		transform: rotate(45deg);
	}
`
export const PopoverContent = forwardRef<
	HTMLDivElement,
	HTMLProps<HTMLDivElement>
>(function PopoverContent({ style, ...props }, propRef) {
	const { context: floatingContext, ...context } = usePopoverContext()
	const ref = useMergeRefs([context.refs.setFloating, propRef])

	if (!floatingContext.open) return null

	return (
		<FloatingPortal>
			<FloatingFocusManager context={floatingContext} modal={context.modal}>
				<PopoverContentContainer
					ref={ref}
					style={{ ...context.floatingStyles, ...style }}
					aria-labelledby={context.labelId}
					aria-describedby={context.descriptionId}
					{...context.getFloatingProps(props)}
				>
					{props.children}
				</PopoverContentContainer>
			</FloatingFocusManager>
		</FloatingPortal>
	)
})
//#endregion

//#region POPOVER HEADING
export const PopoverHeading = forwardRef<
	HTMLHeadingElement,
	HTMLProps<HTMLHeadingElement>
>(function PopoverHeading(props, ref) {
	const { setLabelId } = usePopoverContext()
	const id = useId()

	useLayoutEffect(() => {
		setLabelId(id)
		return () => setLabelId(undefined)
	}, [id, setLabelId])

	return (
		<h2 {...props} ref={ref} id={id}>
			{props.children}
		</h2>
	)
})
//#endregion

//#region POPOVER DESCRIPTION
export const PopoverDescription = forwardRef<
	HTMLParagraphElement,
	HTMLProps<HTMLParagraphElement>
>(function PopoverDescription(props, ref) {
	const { setDescriptionId } = usePopoverContext()
	const id = useId()

	useLayoutEffect(() => {
		setDescriptionId(id)
		return () => setDescriptionId(undefined)
	}, [id, setDescriptionId])

	return <p {...props} ref={ref} id={id} />
})
//#endregion

//#region POPOVER CLOSE
export const PopoverClose = forwardRef<
	HTMLButtonElement,
	ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose(props, ref) {
	const { setOpen } = usePopoverContext()
	return (
		<button
			type='button'
			ref={ref}
			{...props}
			onClick={(event) => {
				props.onClick?.(event)
				setOpen(false)
			}}
		/>
	)
})
//#endregion
