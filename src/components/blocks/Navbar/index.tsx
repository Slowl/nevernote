import { styled } from '@linaria/react'
import { Link, useLocation } from 'react-router-dom'
import { TbLogout2, TbSettings } from 'react-icons/tb'
import { routes } from '@/routes/index'
import { supabase } from '@/services/supabase'
import { useNoteStore, useUserStore } from '@/store/index'
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

	@media screen and (max-width: 650px) {
		width: 100%;
		flex-direction: row;
		position: fixed;
		bottom: 0;
		padding: .7rem 1rem 1.5rem;
		z-index: 999;
		.top-container {
			flex-direction: row;
			gap: 2rem;
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

const NavigationItem = styled.div<{ isCurrent?: boolean, label: string }>`
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
	
	.nav-item-label { display: none; }

	@media screen and (max-width: 650px) {
		width: 34px; height: 34px;
		.nav-item-label {
			display: block;
			position: absolute;
			bottom: -18px;
			width: 140%;
			text-align: center;
			font-size: .55rem;
		}
	}
`
//#endregion

const Navbar = () => {

	//#region SETUP
	const { pathname } = useLocation();
	const currentUser = useUserStore((state) => state.currentUser)
	const setIsNoteFormLoading = useNoteStore((state) => state.setIsNoteFormLoading)
	const setIsMobileListNoteVisible = useNoteStore((state) => state.setIsMobileListNoteVisible)
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
	//#endregion

	//#region RENDER
	return (
		<NavContainer>
			<div className='top-container'>
				<img className='logo' src={NevernoteLogo}/>
				{Object.values(routes).map((route) => (
					<Link to={route.path} title={route.title} key={route.path}>
						<Tooltip placement='right'>
							<TooltipTrigger>
								<NavigationItem
									isCurrent={route.path === pathname}
									onClick={handleNavigationClick}
									label={`${route.title}`}
								>
									<route.icon />
									<div className='nav-item-label'> {route.title} </div>
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
							<NavigationItem className='settings-item' title='Settings' label='Settings'>
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
								label='Log out'
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