import { Navigate, useLoaderData } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { css } from '@linaria/core'
import { styled } from '@linaria/react'
import { supabase } from '@/services/supabase'
import useSupabaseSession from '@/utils/hooks/useSupabaseSession'

//#region STYLE
const AuthViewContainer = styled.div`
	height: 100svh;
	display: flex;
	justify-content: center;
	align-items: center;
	> div {
		width: 480px;
		display: flex;
		flex-direction: column;
		background-color: #202020;
		padding: 2.5rem;
		border: 2px solid #222222;
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
				color: #dddddd;
				background-color: #2e2e2e;
				cursor: pointer;
				transition: .3s;
				&:hover { background-color: #363636; }
			}
		}
	}
`

const AuthDividerStyle = css`
	height: 2px;
	border-radius: 10px;
	background-color: #282828;
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
	border: 1px solid #363636;
	border-radius: 4px;
	padding: .6rem .5rem;
	margin-bottom: 1rem;
	background-color: #202020;
	color: #dddddd;
	transition: .2s;
	&:focus {
		outline: 0;
		border: 1px solid #606060;
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
	color: #dddddd;
	background-color: #2e2e2e;
	cursor: pointer;
	transition: .3s;
	&:hover { background-color: #363636; }
`

const AuthAnchorStyle = css`
	display: block;
	text-align: center;
	font-size: .8rem;
	color: #9b9b9b;
	text-decoration: none;
	transition: .2s;
	&:hover {
		color: #dddddd;
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
	background-color: #ba5050;
  border-radius: 8px;
	font-size: .9rem;
  font-weight: bold;
`
//#endregion

const AuthView = () => {
	
	const session = useLoaderData() as Session | null
	const currentSession = useSupabaseSession(supabase, session)
	
	if (currentSession) {
		return <Navigate to='/'/>
	}

	return (
		<AuthViewContainer>
			<Auth
				supabaseClient={supabase}
				providers={['google', 'notion']}
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