import { styled } from '@linaria/react'
import { TbLoader2 } from 'react-icons/tb'

//#region STYLES
const LoaderContainer = styled.div`
	@keyframes RotateLoader {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	width: 100%; height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	svg {
		width: 36px; height: 36px;
		animation: RotateLoader .7s ease infinite;
		opacity: .25;
	}
`
//#endregion

const Loader = () => {

	return (
		<LoaderContainer>
			<TbLoader2 />
		</LoaderContainer>
	)
}

export default Loader