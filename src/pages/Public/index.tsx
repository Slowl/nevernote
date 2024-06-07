import NevernoteLogo from '../../assets/nevernote_white512.png'
import { themeDark } from '../../styles'
import { styled } from '@linaria/react'
import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { TbArrowRight, TbLogin2 } from 'react-icons/tb'
import { OutputData } from '@editorjs/editorjs'
import { supabase } from '@/services/supabase'
import useSupabaseSession from '@/utils/hooks/useSupabaseSession'
import Loader from '@/components/ui/Loader'
import Editor from '@/components/ui/Editor'
import Button from '@/components/ui/Button'

//#region STYLES
const AppContainer = styled.div`
	position: relative;
	width: 100%; height: 100svh;
`
const PublicNavBar = styled.nav`
	position: sticky;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: .7rem 1rem;
	background-color: var(--color-black-1);
	border-radius: 20px 20px 0 0;

	div {
		display: flex;
		align-items: center;
		gap: .6rem;
		img {
			display: block;
			width: 38px; height: 38px;
		}
		span {
			font-size: 1.2rem;
			font-weight: bold;
			letter-spacing: 1px;
		}
	}

	@media screen and (max-width: 650px) {
		div {
			img {
				display: block;
				width: 34px; height: 34px;
			}
			span {
				font-size: 1.1rem;
			}
		}
	}
`
const FormNoteContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 1rem .2rem;
	z-index: 0;
	@media screen and (max-width: 650px) {
		height: calc(100svh - 48px);
	}
`
const FormInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 100%;
	height: 90vh;
	gap: .5rem 0;
	overflow-y: auto;
	scrollbar-color: var(--color-black-3) rgba(0,0,0,0);
	scrollbar-width: thin;

	@media screen and (max-width: 650px) {
		overflow-x: hidden;
	}
`
const FormHead = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	width: calc(100% - 110px);
	margin: auto;
	> input[type='text'] {
		flex-grow: 1;
		padding: .4rem 0;
		font-size: 1.3rem;
		font-weight: bold;
		border: 0;
		color: var(--color-grey-0);
		background-color: var(--color-black-0);

		&:focus-visible {
			outline: 0;
		}
	}
	@media screen and (max-width: 650px) {
		width: calc(100% - 35px);
	}
`
const FormBody = styled.div`
	display: flex;
	flex-grow: 1;
	height: 85svh; min-height: 20vh;
`
const NoNoteFallback = styled.div`
	width: 100%;
	height: 90vh;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 2rem;
	font-size: 1.5rem;
	letter-spacing: 1px;
`
//#endregion

const PublicNote = () => {

	//#region SETUP
	const { publicNoteId } = useParams()
	const session = useLoaderData() as Session | null
	const currentSession = useSupabaseSession(supabase, session)
	const [isLoading, setIsLoading] = useState(false)
	const [content, setContent] = useState<OutputData>()
	const [title, setTitle] = useState('')
	//#endregion

	//#region CORE
	useEffect(
		() => {
			setIsLoading(true)
			Promise.allSettled([
				supabase.rpc('getPublicNoteTitle', { note_id: publicNoteId ?? '' })
					.then((response) => response.data),
				supabase.rpc('getPublicNoteContent', { note_id: publicNoteId ?? '' })
					.then((response) => response.data),
			])
			.then(([title, content]) => {
				//@ts-expect-error
				setTitle(title.value)
				//@ts-expect-error
				setContent(content.value)
				setIsLoading(false)
			})
		},
		[publicNoteId]
	)
	//#endregion

	//#region RENDER
	return (
		<AppContainer className={themeDark}>
			<FormNoteContainer>
				<FormInputContainer>
					{(isLoading)  
						? <Loader />
						: (title && content)
							? (
								<>
									<FormHead>
										<input
											type='text'
											onChange={(event => setTitle(event.target.value))}
											value={title}
											disabled
										/>
									</FormHead>
									<FormBody>
										<Editor
											configuration={{
												holder: 'public-note-editor',
												data: content as OutputData,
												autofocus: false,
												readOnly: true,
											}}
										/>
									</FormBody>
								</>
							)
							: (
								<NoNoteFallback>
									The note you are trying to get is not available anymore ... :(
								</NoNoteFallback>
							)
					}
				</FormInputContainer>
			</FormNoteContainer>
			<PublicNavBar>
				<div>
					<img src={NevernoteLogo}/>
					<span> Nevernote. </span>
				</div>
				<div>
					<Button href='/'>
						{currentSession?.user.id
							? <> My notes <TbArrowRight /></>
							: <> Sign-in <TbLogin2 /> </>
						}
					</Button>
				</div>
			</PublicNavBar>
		</AppContainer>
	)
	//#endregion
}

export default PublicNote