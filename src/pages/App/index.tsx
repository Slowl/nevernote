import { Navigate, useLoaderData } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'
import useSupabaseSession from '@/utils/hooks/useSupabaseSession'

const App = () => {

	const session = useLoaderData() as Session | null
	const currentSession = useSupabaseSession(supabase, session)

	if (!(currentSession)) {
		return <Navigate to='/login'/>
	}

	return (
		<>
			MAIN APP
			<div>
				<div>Logged in!</div>
				<button onClick={() => supabase.auth.signOut()}>Sign out</button>
			</div>
		</>
	)
}

export default App