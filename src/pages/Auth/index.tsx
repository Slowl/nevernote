import { themeDark } from '../../styles'
import { Auth } from '@supabase/auth-ui-react'
import { css } from '@linaria/core'
import { styled } from '@linaria/react'
import { supabase } from '@/services/supabase'

//#region STYLE
const AuthViewContainer = styled.div`
	height: 100svh;
	display: flex;
	justify-content: center;
	align-items: center;
	> div {
		width: 510px;
		display: flex;
		flex-direction: column;
		background-color: var(--color-black-1);
		padding: 2.5rem;
		border: 2px solid var(--color-black-2);
		border-radius: 8px;
		> div:first-child > div {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: .5rem;
			& button {
				width: 50%;
				margin: auto;
				display: flex;
				align-items: center;
				gap: 0 1rem;
				padding: .6rem .5rem;
				border: 0px solid transparent;
				border-radius: 6px;
				color: var(--color-grey-0);
				background-color: var(--color-black-4);
				font-size: .9rem;
				cursor: pointer;
				transition: .3s;
				&:hover { background-color: var(--color-black-5); }
			}
		}
	}
`

const AuthDividerStyle = css`
	height: 2px;
	border-radius: 10px;
	background-color: var(--color-black-3);
	margin: 1.8rem 0 1.6rem;
`;

const AuthLabelStyle = css`
	display: block;
	width: 100%;
	font-size: .85rem;
	padding-bottom: .2rem;
`

const AuthInputStyle = css`
	display: block;
	width: 100%;
	border: 1px solid var(--color-black-5);
	border-radius: 4px;
	padding: .6rem .5rem;
	margin-bottom: 1rem;
	background-color: var(--color-black-1);
	color: var(--color-grey-0);
	transition: .2s;
	&:focus {
		outline: 0;
		border: 1px solid var(--color-grey-2);
	}
`

const AuthButtonStyle = css`
	min-width: 50%;
	margin: 0 auto 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0 1rem;
	padding: .6rem .5rem;
	border: 0px solid transparent;
	border-radius: 6px;
	color: var(--color-grey-0);
	background-color: var(--color-black-4);
	cursor: pointer;
	transition: .3s;
	&:hover { background-color: var(--color-black-5); }
`

const AuthAnchorStyle = css`
	display: block;
	text-align: center;
	font-size: .8rem;
	color: var(--color-grey-1);
	text-decoration: none;
	transition: .2s;
	&:hover {
		color: var(--color-grey-0);
		text-decoration: underline;
	}
	&:first-child { margin-bottom: .2rem; }
`

const AuthMessageStyle = css`
  display: flex;
  justify-content: center;
  position: relative;
  bottom: -15px;
  padding: .5rem;
	background-color: var(--color-black-5);
  border-radius: 8px;
	font-size: .9rem;
  font-weight: bold;
`
//#endregion

const AuthView = () => {

	const currentLocation = window.location
	
	return (
		<AuthViewContainer className={themeDark}>
			<Auth
				supabaseClient={supabase}
				providers={['google', 'notion']}
				redirectTo={`${currentLocation.origin}/my-notes`}
				appearance={{
					extend: false,
					className: {
						divider: AuthDividerStyle,
						label: AuthLabelStyle,
						input: AuthInputStyle,
						button: AuthButtonStyle,
						anchor: AuthAnchorStyle,
						message: AuthMessageStyle,
					},
				}}
				localization={{
					variables: {
						sign_in: {
							email_label: 'Email',
							password_label: 'Password',
							email_input_placeholder: '',
							password_input_placeholder: '',
						},
						sign_up: {
							email_label: 'Email',
							password_label: 'Create a password',
							email_input_placeholder: '',
							password_input_placeholder: '',
							social_provider_text: 'Continue with {{provider}}',
						},
						forgotten_password: {
							email_label: 'Email',
							email_input_placeholder: '',
							button_label: 'Reset your password',
						},
						update_password: {
							password_label: 'Your new password',
							password_input_placeholder: '',
						}
					},
				}}
			/>
		</AuthViewContainer>
	)
}

export default AuthView