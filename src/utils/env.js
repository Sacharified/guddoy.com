import getConfig from "next/config";
const { publicRuntimeConfig = {}, serverRuntimeConfig = {} } = getConfig() || {};
export const {
    CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID,
    OXFORD_DICTIONARY_APP_ID,
    OXFORD_DICTIONARY_APP_KEY,
    HASURA_URL,
    HASURA_SECRET
} = publicRuntimeConfig;

export const { BOOKMARK_COOKIE_SECRET } = serverRuntimeConfig;