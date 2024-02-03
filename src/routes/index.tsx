import { createBrowserRouter, redirect } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import App from '@/pages/App'
import AuthView from '@/pages/Auth'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		loader: async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if (!(session)) { return redirect('/login') }

			return session
		},
	},
	{
		path: '/login',
		element: <AuthView />,
		loader: async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if (session) { return redirect('/') }

			return null
		},
	},
])