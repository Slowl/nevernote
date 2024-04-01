import {
	HTMLProps,
	ReactNode,
	cloneElement,
	createContext,
	forwardRef,
	isValidElement,
	useContext,
	useMemo,
	useState
} from 'react'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useHover,
	useFocus,
	useDismiss,
	useRole,
	useInteractions,
	useMergeRefs,
	FloatingPortal,
	useTransitionStyles
} from '@floating-ui/react'
import type { Placement } from '@floating-ui/react'
import { styled } from '@linaria/react'


//#region HOOKS & TYPES
interface TooltipOptions {
	initialOpen?: boolean;
	placement?: Placement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const useTooltip = ({
	initialOpen = false,
	placement = 'top',
	open: controlledOpen,
	onOpenChange: setControlledOpen
}: TooltipOptions = {}) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

	const open = controlledOpen ?? uncontrolledOpen
	const setOpen = setControlledOpen ?? setUncontrolledOpen

	const data = useFloating({
		placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(3),
			flip({
				crossAxis: placement.includes('-'),
				fallbackAxisSideDirection: 'start',
				padding: 3
			}),
			shift({ padding: 3 })
		]
	})

	const context = data.context

	const hover = useHover(context, {
		move: false,
		enabled: controlledOpen == null
	})
	const focus = useFocus(context, {
		enabled: controlledOpen == null
	})
	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'tooltip' })

	const interactions = useInteractions([hover, focus, dismiss, role])

	return useMemo(
		() => ({
			open,
			setOpen,
			...interactions,
			...data
		}),
		[open, setOpen, interactions, data]
	)
}

type ContextType = ReturnType<typeof useTooltip> | null

const TooltipContext = createContext<ContextType>(null)

export const useTooltipContext = () => {
	const context = useContext(TooltipContext)

	if (context == null) {
		throw new Error('Tooltip components must be wrapped in <Tooltip />')
	}

	return context
}
//#endregion

//#region TOOLTIP
export const Tooltip = ({
	children,
	...options
}: { children: ReactNode } & TooltipOptions) => {
	const tooltip = useTooltip(options)
	return (
		<TooltipContext.Provider value={tooltip}>
			{children}
		</TooltipContext.Provider>
	)
}
//#endregion

//#region TOOLTIP TRIGGER
export const TooltipTrigger = forwardRef<
	HTMLElement,
	HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
	const context = useTooltipContext()
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

//#region TOOLTIP CONTENT
const TooltipContentContainer = styled.div`
	color: #dddddd;
	background-color: #1e1e1e;
	padding: .2rem .7rem;
	border: 1px solid #2e2e2e;
	border-radius: 100px;
	font-size: .75rem;
`

export const TooltipContent = forwardRef<
	HTMLDivElement,
	HTMLProps<HTMLDivElement>
>(function TooltipContent({ style, ...props }, propRef) {
	const { context, getFloatingProps } = useTooltipContext()
	const { isMounted, styles } = useTransitionStyles(context, {
		duration: 300,
	});
	const ref = useMergeRefs([context.refs.setFloating, propRef])

	if (!context.open) return null

	return (
		<FloatingPortal>
			{isMounted && (
				<TooltipContentContainer
					ref={ref}
					style={{
						...context.floatingStyles,
						...style,
						...styles,
					}}
					{...getFloatingProps(props)}
				/>
			)}
		</FloatingPortal>
	)
})
//#endregion
