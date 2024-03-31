import { styled } from "@linaria/react"

const UserContainer = styled.div`
	display: flex;
	align-items: center;
	gap: .2rem;
`

const AvatarContainer = styled.div<{ avatar?: string | null }>`
	border: 1px solid var(--color-black-5);
	width: 16px;
	height: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--color-black-1);
	background-image: ${({ avatar }) => avatar ? avatar : ''};
	background-position: center;
	background-size: cover;
	border-radius: 50%;
	font-size: .52rem;
`

const NameContainer = styled.div`
	background-color: var(--color-black-4);
	padding: .1rem .3rem;
	border-radius: 4px;
`

const User = ({ firstName, lastName, avatar }: {
	firstName: string | null;
	lastName?: string | null;
	avatar?: string | null;
}) => {

	return (
		<UserContainer>
			<AvatarContainer avatar={avatar}>
				{!(avatar) && `${firstName?.at(0)?.toUpperCase()}${(lastName) ? lastName.at(0) : '' }`}
			</AvatarContainer>
			<NameContainer>
				{`${firstName} ${(lastName) ? lastName : '' }`}
			</NameContainer>
		</UserContainer>
	)
}

export default User