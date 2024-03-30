import { themeDark } from '../../styles'
import { useEffect } from 'react'
import { Navigate, useLoaderData, useSearchParams } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { styled } from '@linaria/react'
import { useNoteStore } from '@/store/index'
import { supabase } from '@/services/supabase'
import useSupabaseSession from '@/utils/hooks/useSupabaseSession'
import Navbar from '@/components/blocks/Navbar'
import { NotesListLayout } from '@/components/blocks/NotesList'
import { createNote, updateNote } from '@/utils/api'

//#region STYLE
const AppContainer = styled.div`
	width: 100%; height: 100svh;
	display: flex;
`
const MainContainer = styled.div`
	width: 100%;
`
const EditorContainer = styled.div`
	border: 1px solid white;
	width: 100%;
	display: flex;

	.notes {
		width: 30%;
	}
	.inputs {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
`
//#endregion

const App = () => {

	const session = useLoaderData() as Session | null
	const currentSession = useSupabaseSession(supabase, session)
	//#region TO MOVE WITH FORM
	const [searchParams, _] = useSearchParams()
	const note = useNoteStore((state) => state.note)
	const setViewedNote = useNoteStore((state) => state.setViewedNote)
	const setTitle = useNoteStore((state) => state.setTitle)
	const setContent = useNoteStore((state) => state.setContent)
	
	useEffect(
		() => {
			if (searchParams.get('viewed')) {
				getCurrentViewedNote(searchParams.get('viewed')!)
					.then((currentNote) => setViewedNote(currentNote))
			}
		},
		[],
	)

	const getCurrentViewedNote = async (noteId: string) => {
		const { data } = await supabase.from('notes')
			.select()
			.eq('id', noteId)
			.limit(1)

		return data && data[0]
	}
	//#endregion

	if (!(currentSession)) {
		return <Navigate to='/login'/>
	}

	return (
		<AppContainer className={themeDark}>
			<Navbar />
			<NotesListLayout />
			<MainContainer>
				<EditorContainer>
					<div className='inputs'>
						<input type='text' onChange={(event => setTitle(event.target.value))} value={note?.title ?? ''} />
						<textarea onChange={(event => setContent(event.target.value))} value={note?.content as string ?? ''}></textarea>
					</div>
				</EditorContainer>
				<div
					style={{ display: 'inline-block', border: '1px solid white', padding: '.5rem' }}
					onClick={() => note?.id
						? updateNote({
							id: note.id,
							title: note.title ?? '',
							content: note.content as any,
							updated_by: currentSession.user.id,
						})
						: createNote({
							title: note?.title ?? '',
							content: note?.content as any,
							created_by: currentSession.user.id,
						})}
				>
					send
				</div>
			</MainContainer>
		</AppContainer>
	)
}

export default App