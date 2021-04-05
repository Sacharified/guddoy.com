import { GQLClient } from "api/services/graphql";

export const ADD_BOOKMARK_CATEGORY_MUTATION = `
    mutation AddBookmarkCategory($DISPLAY_NAME: String = "", $ITEMS: json = "[]") {
        insert_BOOKMARK_CATEGORIES_one(object: {ITEMS: $ITEMS, DISPLAY_NAME: $DISPLAY_NAME}) {
            DISPLAY_NAME
            ITEMS
        }
    }
`;

export const BOOKMARKS_QUERY = `
	query GetBookmarks {
		BOOKMARKS {
			CREATION_DATE
			DISPLAY_NAME
			ID
			URL
			TAGS
		}
		BOOKMARK_CATEGORIES {
			DISPLAY_NAME
			ID
			ITEMS
		}
	}
`;

export const ADD_BOOKMARK_TO_CATEGORY_MUTATION = `
	mutation AddBookmarkToCategory($_eq: uuid = "", $ITEMS: json = "") {
		update_BOOKMARK_CATEGORIES(_set: {ITEMS: $ITEMS}, where: {ID: {_eq: $_eq}}) {
			returning {
				DISPLAY_NAME
				ID
				ITEMS
			}
		}
  	}
`;

export const ADD_BOOKMARK_MUTATION = `
	mutation AddBookmark($DISPLAY_NAME: String = "", $TAGS: json = "[]", $URL: String = "") {
		insert_BOOKMARKS_one(object: {DISPLAY_NAME: $DISPLAY_NAME, TAGS: $TAGS, URL: $URL}) {
			DISPLAY_NAME
			CREATION_DATE
			ID
			TAGS
			URL
		}
	}
`;

export const addBookmarkCategory = (DISPLAY_NAME = "", ITEMS = []) => GQLClient.mutation(ADD_BOOKMARK_CATEGORY_MUTATION, {
	DISPLAY_NAME,
	ITEMS
}).toPromise();

export const addBookmark = (URL, DISPLAY_NAME = "", TAGS = []) => GQLClient.mutation(ADD_BOOKMARK_MUTATION, {
	URL,
	TAGS,
	DISPLAY_NAME
}).toPromise();