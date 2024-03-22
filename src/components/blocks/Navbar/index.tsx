import { styled } from '@linaria/react'
import { supabase } from '@/services/supabase'
import { TbLogout2, TbSettings } from 'react-icons/tb'
import NevernoteLogo from '../../../assets/nevernote_white512.png'

//#region STYLES
const NavContainer = styled.nav`
	background-color: var(--color-black-1);
	padding: 1.5rem 1rem;
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	justify-content: space-between;

	.top-container {
		.logo {
			display: block;
			width: 44px; height: 44px;
			margin: 0 auto 2rem;
		}
	}

	.bottom-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex-shrink: 0;

		.action-item {
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
	}
`
//#endregion

const Navbar = () => {

	return (
		<NavContainer>
			<div className='top-container'>
				<img className='logo' src={NevernoteLogo}/>
			</div>
			<div className='bottom-container'>
				<div className='action-item'>
					<TbSettings />
				</div>
				<div
					className='action-item'
					onClick={() => supabase.auth.signOut()}
				>
					<TbLogout2 />
				</div>
			</div>
		</NavContainer>
	)
}

export default Navbar