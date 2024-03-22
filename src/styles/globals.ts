import { css } from '@linaria/core'

export const globals = css`
	:global() {
		@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');
		*, *::before, *::after { box-sizing: border-box; }
		* { margin: 0; }
		html {
			font-family: 'Poppins', sans-serif;
		}
		body {
			background-color: #1c1c1c;
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