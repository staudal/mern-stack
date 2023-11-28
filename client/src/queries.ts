import { gql } from "@apollo/client";

export const GET_WISHLISTS_BY_USER = gql`
	query WishlistsByUser($user_id: ID!) {
		wishlistsByUser(user_id: $user_id) {
			id
			name
			user_id
			date_created
			wishes {
				id
				name
				description
				price
				link
				img_url
			}
		}
	}
`;

export const GET_WISHES_BY_WISHLIST = gql`
	query WishesByWishlist($id: ID!) {
		wishesByWishlist(wishlist_id: $id) {
			id
			name
			description
			price
			link
			img_url
		}
	}
`;

export const GET_WISH_BY_ID = gql`
	query Wish($id: ID!) {
		wish(id: $id) {
			id
			name
			description
			price
			link
			img_url
		}
	}
`;

export const GET_WISHLIST = gql`
	query Wishlist($id: ID!) {
		wishlist(id: $id) {
			id
			name
		}
	}
`;

export const CREATE_WISH = gql`
	mutation CreateWish($wishlist_id: ID!, $name: String!, $description: String!, $price: Float!, $link: String!, $img_url: String!) {
		createWish(wishlist_id: $wishlist_id, name: $name, description: $description, price: $price, link: $link, img_url: $img_url) {
			id
			wishlist_id
			name
			description
			price
			link
			img_url
		}
	}
`;

export const DELETE_WISH = gql`
	mutation DeleteWish($id: ID!) {
		deleteWish(id: $id)
	}
`;

export const DELETE_WISHLIST = gql`
	mutation DeleteWishlist($id: ID!) {
		deleteWishlist(id: $id)
	}
`;

export const CREATE_WISHLIST = gql`
	mutation CreateWishlist($name: String!, $user_id: String!) {
		createWishlist(name: $name, user_id: $user_id) {
			id
			name
			user_id
		}
	}
`;
