import { useEffect } from 'react'
import { Navigate, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { styled } from '@linaria/react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'
import useSupabaseSession from '@/utils/hooks/useSupabaseSession'
import { useUserStore } from '@/store/index'
import Navbar from '@/components/blocks/Navbar'
import { NotesListLayout } from '@/components/blocks/NotesList'
import FormNote from '@/components/blocks/Form/Note'
import { themeDark } from '../../styles'
import { routes } from '@/routes/index'

//#region STYLES
const AppContainer = styled.div`
	width: 100%; height: 100svh;
	display: flex;
`
//#endregion

const App = () => {

	//#region SETUP
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const session = useLoaderData() as Session | null
	const currentSession = useSupabaseSession(supabase, session)
	const getCurrentUser = useUserStore((state) => state.getCurrentUser)
	const resetCurrentUser = useUserStore((state) => state.resetCurrentUser)
	//#endregion

	//#region CORE
	useEffect(
		() => {
			if (currentSession?.user.id) {
				getCurrentUser(currentSession.user.id)
			}
			if (pathname === '/') {
				navigate(routes.MY_NOTES.path)
			}

			return () => { resetCurrentUser() }
		},
		[currentSession?.user.id],
	)
	//#endregion

	//#region RENDER
	if (!(currentSession)) {
		return <Navigate to='/login'/>
	}

	return (
		<AppContainer className={themeDark}>
			<Navbar />
			<NotesListLayout />
			<FormNote />
		</AppContainer>
	)
	//#endregion
}

export default App