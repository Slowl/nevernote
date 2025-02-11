import { styled } from '@linaria/react'
import Avatar from '@/components/ui/Avatar'

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
const NameContainer = styled.div<{ size: UserProps['size'] }>`
	background-color: var(--color-black-4);
	padding: .1rem .3rem;
	border-radius: 4px;
	white-space: nowrap;
	font-size: ${({ size }: { size: UserProps['size'] }) => size ? sizes[size].font : ''};
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
			<Avatar firstName={firstName} lastName={lastName} avatar={avatar} size={size} />
			<NameContainer size={size ?? 'sm'}>
				{`${firstName} ${(lastName) ? lastName : '' }`}
			</NameContainer>
		</UserContainer>
	)
}

export default User