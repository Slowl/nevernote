import { css } from '@linaria/core'

export const globals = css`
	:global() {
		@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');
		html {
			box-sizing: border-box;
			font-family: 'Poppins', sans-serif;
		}

		body {
			background-color: #1c1c1c;
			color: #dddddd;
			margin: 0; padding: 0; border: 0;
		}

		*,
		*:before,
		*:after {
			box-sizing: inherit;
		}
	}
`