// eslint-disable-next-line no-global-assign
require = require("esm")(module);
require("dotenv").config()
const withImages = require("next-images");
const { merge } = require("webpack-merge");
const path = require("path");
const getContent = require("./scripts/get-content");
// const getImages = require("./scripts/get-images");

const {
	CONTENTFUL_ACCESS_TOKEN,
	CONTENTFUL_SPACE_ID,
	OXFORD_DICTIONARY_APP_ID,
	OXFORD_DICTIONARY_APP_KEY,
	HASURA_SECRET,
	HASURA_URL,
	BOOKMARK_COOKIE_SECRET,
	NODE_ENV
} = process.env;
module.exports = withImages({
	webpack(config) {
		return merge({
			resolve: {
				modules: [
					path.join(__dirname, "src"),
					path.join(__dirname, "static"),
				]
			}
		}, config);
	},
	distDir: "../.next",
	target: "serverless",
	serverRuntimeConfig: {
		BOOKMARK_COOKIE_SECRET
	},
	publicRuntimeConfig: {
		mode: NODE_ENV,
		CONTENTFUL_ACCESS_TOKEN,
		CONTENTFUL_SPACE_ID,
		OXFORD_DICTIONARY_APP_ID,
		OXFORD_DICTIONARY_APP_KEY,
		HASURA_SECRET,
		HASURA_URL
	},
	exportPathMap: async function () {
		const paths = {
			"/": { page: "/" },
			"/blog": { page: "/blog" },
			"/anagram": { page: "/anagram" },
		};
		const { items } = await getContent();
		// await getImages(Asset);
		items.forEach(post => {
			paths[`/post/${post.fields.slug}`] = { page: "/post", query: { id: post.sys.id, slug: post.fields.slug } };
		});

		return paths;
	},
	headers: async () => {
		return [
		{
			source: "/api/bookmarks",
			headers: [
				{
					key: "access-control-allow-origin",
					value: "*",
				}
			],
		},
		]
	},
});