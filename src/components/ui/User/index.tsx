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
	}
}

const UserContainer = styled.div`
	display: flex;
	align-items: center;
	gap: .2rem;
	color: var(--color-grey-0);
`
const AvatarContainer = styled.div<{ avatar?: UserProps['avatar']; size: UserProps['size'] }>`
	border: 1px solid var(--color-black-5);
	width: ${({ size }) => size ? sizes[size].avatar.width : ''};
	height: ${({ size }) => size ? sizes[size].avatar.height : ''};
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--color-black-1);
	background-image: ${({ avatar }) => avatar ? `url(${avatar})` : ''};
	background-position: center;
	background-size: cover;
	border-radius: 50%;
	font-size: .52rem;
`
const NameContainer = styled.div<{ size: UserProps['size'] }>`
	background-color: var(--color-black-4);
	padding: .1rem .3rem;
	border-radius: 4px;
	font-size: ${({ size }) => size ? sizes[size].font : ''};
`
//#endregion

interface UserProps {
	firstName: string | null;
	lastName?: string | null;
	avatar?: string | null;
	size?: 'sm' | 'md' | 'lg';
}

const User = ({ firstName, lastName, avatar, size }: UserProps) => {
	return (
		<UserContainer>
			<AvatarContainer avatar={avatar} size={size ?? 'sm'}>
				{!(avatar) && `${firstName?.at(0)?.toUpperCase()}${(lastName) ? lastName.at(0) : '' }`}
			</AvatarContainer>
			<NameContainer size={size ?? 'sm'}>
				{`${firstName} ${(lastName) ? lastName : '' }`}
			</NameContainer>
		</UserContainer>
	)
}

export default User