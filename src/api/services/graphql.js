import { HASURA_SECRET, HASURA_URL } from "utils/env";
import { createClient } from "urql";

export const hasuraClientConfig = {
    url: HASURA_URL,
    fetchOptions: () => ({
        headers: {
            "x-hasura-admin-secret": HASURA_SECRET
        }
    })
}

export const GQLClient = createClient(hasuraClientConfig);