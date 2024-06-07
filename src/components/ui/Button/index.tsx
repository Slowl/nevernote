import { styled } from '@linaria/react'
import { AnchorHTMLAttributes, ClassAttributes, ReactNode } from 'react';

const ButtonContainer = styled.a<{ size: 'sm' | 'md' }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	gap: ${({ size }) => size === 'md' ? '1rem' : '.5rem'};
	padding: ${({ size }) => size === 'md' ? '.3rem .8rem' : '.15rem .6rem'};
	margin: auto;
	border: 1px solid var(--color-black-5);
	background-color: var(--color-black-1);
	color: var(--color-grey-0);
	text-decoration: none;
	font-size: ${({ size }) => size === 'md' ? '.85rem' : '.7rem'};
	border-radius: 40px;
	cursor: pointer;
	transition: .2s;

	> svg {
		width: ${({ size }) => size === 'md' ? '14px' : '10px'};
		height: ${({ size }) => size === 'md' ? '14px' : '10px'};
		flex-shrink: 0;
	}

	&:hover {
		border-color: var(--color-black-3);
		background-color: var(--color-black-3);
	}
	&:focus-visible {
		outline: 0;
	}

	.disabled {
		cursor: default;
		background-color: var(--color-black-5);
		color: var(--color-grey-2);
		&:hover {				
			background-color: var(--color-black-5);
			color: var(--color-grey-2);
		}
	}

	@media screen and (max-width: 650px) {
		padding: .35rem 1rem;
		font-size: .80rem;
		> svg {
			width: 14px; height: 14px;
		}
	}
`

const Button = ({ children, size = 'md', isDisabled, ...props }: {
	children: ReactNode;
	size?: 'sm' | 'md';
	isDisabled?: boolean;
} & ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement>) => {

	return (
		<ButtonContainer
			{...props}
			className={isDisabled ? 'disabled' : ''}
			size={size}
			rel='noreferrer noopener'
		>
			{children}
		</ButtonContainer>
	)
}

export default Button