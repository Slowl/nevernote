import { styled } from '@linaria/react'
import { TbLogout2, TbSettings } from 'react-icons/tb'
import { supabase } from '@/services/supabase'
import NevernoteLogo from '../../../assets/nevernote_white512.png'
import { Link } from 'react-router-dom'
import { routes } from '@/routes/index'

//#region STYLES
const NavContainer = styled.nav`
	background-color: var(--color-black-1);
	padding: 1rem;
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	justify-content: space-between;
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
		flex-direction: column;
		gap: 1rem;
		flex-shrink: 0;
	}

	.action-item {
			color: var(--color-white);
			background-color: var(--color-black-3);
			width: 38px; height: 38px;
			padding: .4rem;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			cursor: pointer;
			transition: .2s;
			svg {
				width: 18px; height: 18px;
			}

			&:hover {
				background-color: var(--color-black-4);
			}
		}
`
//#endregion

const Navbar = () => {

	return (
		<NavContainer>
			<div className='top-container'>
				<img className='logo' src={NevernoteLogo}/>
				{Object.values(routes).map((route) => (
					<Link to={route.path} title={route.title} key={route.path}>
						<div className='action-item'>
							<route.icon />
						</div>
					</Link>
				))}
			</div>

			<div className='bottom-container'>
				<div className='action-item' title='Settings'>
					<TbSettings />
				</div>
				<div
					className='action-item'
					onClick={() => supabase.auth.signOut()}
					title='Log out'
				>
					<TbLogout2 />
				</div>
			</div>
		</NavContainer>
	)
}

export default Navbar