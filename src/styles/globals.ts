import { css } from '@linaria/core'

export const globals = css`
	:global() {
		@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');
		@view-transition {
			navigation: auto;
		}
		*, *::before, *::after { box-sizing: border-box; }
		* { margin: 0; }
		html {
			overflow: hidden;
			font-family: 'Poppins', sans-serif;
			--color-black: #000;
			--color-black-0: #1c1c1c;
			--color-black-1: #202020;
			--color-black-2: #222222;
			--color-black-3: #282828;
			--color-black-4: #2e2e2e;
			--color-black-5: #363636;
			--color-black-6: #3f3f3f;
			--color-white: #fff;
			--color-grey-0: #dddddd;
			--color-grey-1: #9b9b9b;
			--color-grey-2: #606060;
			--color-grey-3: #4b4b4b;
			--color-green-0: #3eca57;
			--color-red-0: #ca3e3e;
		}
		body {
			background-color: var(--color-black-0);
			color: #dddddd;
			line-height: 1.5;
			-webkit-font-smoothing: antialiased;
		}
		img, picture, video, canvas, svg {
			display: block;
			max-width: 100%;
		}
		input, button, textarea, select { font: inherit; }
		p, h1, h2, h3, h4, h5, h6 {
			overflow-wrap: break-word;
		}
	}
`