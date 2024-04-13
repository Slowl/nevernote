import { MouseEvent } from 'react'
import { styled } from '@linaria/react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { TbLogout2, TbSettings, TbPlus } from 'react-icons/tb'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { supabase } from '@/services/supabase'
import { getUser } from '@/utils/queries'
import { routes } from '@/routes/index'
import { useGeneralStore, useNoteStore, useUserStore } from '@/store/index'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip'
import PopoverMenu from '@/components/ui/PopoverMenu'
import Avatar from '@/components/ui/Avatar'
import NevernoteLogo from '../../../assets/nevernote_white512.png'

//#region STYLES
const NavContainer = styled.nav`
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	justify-content: space-between;
	padding: 1rem;
	background-color: var(--color-black-1);
	border-right: 1px solid var(--color-black-4);

	.top-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		.logo {
			display: block;
			width: 44px; height: 44px;
			margin: 0 auto 1rem;
		}
	}

	.bottom-container {
		display: flex;
		align-items: center;
		.desktop-action-container {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			flex-shrink: 0;
		}
		.mobile-action-container {
			display: none;
		}
	}

	* {
		-webkit-tap-highlight-color: transparent;
		-moz-tap-highlight-color: transparent;
	}

	@media screen and (max-width: 650px) {
		width: 100%;
		flex-direction: row;
		position: fixed;
		bottom: 0;
		padding: .7rem 1rem;
		border: 0;
		border-top: 1px solid var(--color-black-4);
		z-index: 999;
		.top-container {
			flex-direction: row;
			gap: 1rem;
			padding-left: 4rem;
			.logo { display: none; }
		}
		.bottom-container {
			flex-direction: row;
			align-items: center;
			.desktop-action-container { display: none; }
			.mobile-action-container { display: block; }
		}
	}
	@media screen and (min-width: 651px) and (max-width: 1024px) {
	};
`

const NavigationItem = styled.div<{ isCurrent?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 38px; height: 38px;
	padding: .4rem;
	color: var(--color-white);
	background-color: var(--color-black-3);
	border: 1px solid ${({ isCurrent }) => isCurrent ? 'var(--color-grey-1)' : 'var(--color-black-3)'};
	border-radius: 50%;
	cursor: pointer;
	transition: .2s;

	svg {
		width: 18px; height: 18px;
	}

	&:hover {
		background-color: var(--color-black-4);
	}
	
	@media screen and (max-width: 650px) {
		width: 42px; height: 42px;
	}
`
const CreateNoteButton = styled.div`
	display: none;
	@media screen and (max-width: 650px) {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		position: absolute;
		left: 10px;
		top: 6px;
		width: 52px; height: 52px;
		padding: .4rem;
		color: var(--color-white);
		background-color: var(--color-black-5);
		border-radius: 50%;
		z-index: 1000;

		&::after {
			content: '';
			display: block;
			width: 35px; height: 1px;
			background-color: var(--color-black-4);
			transform: rotate(90deg);
			position: absolute;
			left: 43px;
		}

		svg {
			width: 26px; height: 26px;
		}
	}
`
//#endregion

const Navbar = () => {

	//#region SETUP
	const navigate = useNavigate()
	const { pathname } = useLocation();
	const [searchParams, setSearchParams] = useSearchParams()
	const currentUserId = useUserStore((state) => state.currentUserId)
	const resetViewedNote = useNoteStore((state) => state.resetViewedNote)
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const isMobileListNoteVisible = useGeneralStore((state) => state.isMobileListNoteVisible)
	const setIsMobileListNoteVisible = useGeneralStore((state) => state.setIsMobileListNoteVisible)
	//#endregion

	//#region CORE
	const { data: currentUser } = useQuery(
		getUser({ userId: currentUserId ?? '' }),
		{ enabled: !!(currentUserId) }
	)
	//#endregion

	//#region EVENTS
	const menuList = [
		{
			title: 'Settings',
			icon: TbSettings,
			event: () => console.log('coming soon ...')
		},
		{
			title: 'Log out',
			icon: TbLogout2,
			event: () => supabase.auth.signOut()
		}
	]

	const handleNavigationClick = () => {
		setIsMobileListNoteVisible(true)
		setIsNoteFormLoading(true)
	}
	const toggleMobileNoteList = (event: MouseEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsMobileListNoteVisible(!(isMobileListNoteVisible))
		setIsNoteFormLoading(false)
	}
	const handleCreateNewNote = () => {
		if (searchParams.get('viewed')) {
			if ((searchParams.get('viewed') === 'new')) {
				return setIsMobileListNoteVisible(false)
			}
			setSearchParams((previousSearchParams) => ({ ...previousSearchParams, viewed: 'new' }))
			setIsNoteFormLoading(true)
			resetViewedNote()
		}
		setIsMobileListNoteVisible(false)
		setIsNoteFormLoading(true)
		navigate(`${routes.MY_NOTES.path}?viewed=new`)
	}
	//#endregion

	//#region RENDER
	return (
		<NavContainer>
			<div className='top-container'>
				<img className='logo' src={NevernoteLogo}/>
				<CreateNoteButton onClick={() => handleCreateNewNote()}>
					<TbPlus />
				</CreateNoteButton>
				{Object.values(routes).map((route) => (
					<Link to={{ pathname: route.path }} title={route.title} key={route.path}>
						<Tooltip placement='right'>
							<TooltipTrigger>
								<NavigationItem
									isCurrent={route.path === pathname}
									onClick={(event) => (route.path === pathname) ? toggleMobileNoteList(event) : handleNavigationClick()}
								>
									<route.icon />
								</NavigationItem>
							</TooltipTrigger>
							<TooltipContent> {route.title} </TooltipContent>
						</Tooltip>
					</Link>
				))}
			</div>

			<div className='bottom-container'>
				<div className='desktop-action-container'>
					<Tooltip placement='right'>
						<TooltipTrigger>
							<NavigationItem className='settings-item' title='Settings'>
								<TbSettings />
							</NavigationItem>
						</TooltipTrigger>
						<TooltipContent> Settings </TooltipContent>
					</Tooltip>
					<Tooltip placement='right'>
						<TooltipTrigger>
							<NavigationItem
								className='settings-item'
								onClick={() => supabase.auth.signOut()}
								title='Log out'
							>
								<TbLogout2 />
							</NavigationItem>
						</TooltipTrigger>
						<TooltipContent> Log out </TooltipContent>
					</Tooltip>
				</div>
				<div className='mobile-action-container'>
					<PopoverMenu list={menuList} options={{ placement: 'top-end' }}>
						{currentUser && (
							<Avatar
								firstName={currentUser?.first_name ?? ''}
								lastName={currentUser?.last_name}
								avatar={currentUser?.avatar}
								size='xxl'
							/>
						)}
					</PopoverMenu>
				</div>
			</div>
		</NavContainer>
	)
	//#endregion
}

export default Navbar