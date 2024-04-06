import { styled } from '@linaria/react'

//#region STYLES
const sizes = {
	sm: {
		font: '.6rem',
		avatar: {
			width: '16px',
			height: '16px',
		}
	},
	md: {
		font: '.8rem',
		avatar: {
			width: '20px',
			height: '20px',
		}
	},
	lg: {
		font: '1rem',
		avatar: {
			width: '24px',
			height: '24px',
		}
	},
	xl: {
		font: '1.2rem',
		avatar: {
			width: '28px',
			height: '28px',
		}
	},
	xxl: {
		font: '1.4rem',
		avatar: {
			width: '40px',
			height: '40px',
		}
	}
}

const AvatarContainer = styled.div<{ avatar?: AvatarProps['avatar']; size: AvatarProps['size'] }>`
	width: ${({ size }) => size ? sizes[size].avatar.width : ''};
	height: ${({ size }) => size ? sizes[size].avatar.height : ''};
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--color-black-1);
	background-image: ${({ avatar }) => avatar ? `url(${avatar})` : ''};
	background-position: center;
	background-size: cover;
	border: 1px solid var(--color-grey-2);
	border-radius: 50%;
	font-size: .52rem;
	flex-shrink: 0;
`
//#endregion

interface AvatarProps {
	firstName: string | null;
	lastName?: string | null;
	avatar?: string | null;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const Avatar = ({ firstName, lastName, avatar, size }: AvatarProps) => {
	return (
		<AvatarContainer avatar={avatar} size={size ?? 'sm'}>
			{!(avatar) && `${firstName && firstName?.at(0)?.toUpperCase()} ${(lastName) ? lastName.at(0) : '' }`}
		</AvatarContainer>
	)
}

export default Avatar