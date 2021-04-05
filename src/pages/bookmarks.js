import React, { useState } from "react";
import Head from "next/head";
import { useQuery, useMutation } from "urql";
import { withUrqlClient } from "next-urql";
import { hasuraClientConfig } from "api/services/graphql";
import {
    BOOKMARKS_QUERY,
    ADD_BOOKMARK_MUTATION,
    ADD_BOOKMARK_TO_CATEGORY_MUTATION,
    addBookmarkCategory
} from "api/features/bookmarks";
import { BOOKMARK_COOKIE_SECRET } from "utils/env";

const Bookmark = ({ CREATION_DATE, DISPLAY_NAME, URL, TAGS = [] }) => (
    <li>
        <h3>
            <a href={URL} target="blank" rel="nofollow">
                {DISPLAY_NAME}
            </a>
        </h3>
        Added: {new Date(CREATION_DATE).toDateString()}
        <br />
        {URL}
        <br />
        Tags:{" "}
        <ul>
            {TAGS.map((tag) => (
                <li key={tag}>{tag}</li>
            ))}
        </ul>
    </li>
);

const sortByCategory = (bookmarkList, categories) => {
    const bookmarks = [...bookmarkList]
    return [
        ...categories.reduce((acc, cat) => {
            const items = cat.ITEMS.map(id => {
                const index = bookmarks.findIndex((b) => b.ID === id);
                const item = bookmarks[index];
                bookmarks.splice(index, 1);
                return item;
            });
            return [...acc, { ...cat, resolvedItems: items }];
        }, []),
        {
            DISPLAY_NAME: "Uncategorised",
            ID: "Uncategorised",
            resolvedItems: bookmarks
        }
    ]
};

const AddCategoryForm = () => {
    const [displayName, setDisplayName] = useState("");

    const submit = async () => {
        addBookmarkCategory(displayName);
        // window.location = window.location; // pro
    };
    return (
        <form>
            <label htmlFor={"display-name"} />
            <input
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                name={"display-name"}
                id={"display-name"}
            />
            <button type="button" onClick={submit}>
                Add
            </button>
        </form>
    );
};

const AddBookmarkForm = ({ category: { ID, ITEMS }, onSubmit }) => {
    const [displayName, setDisplayName] = useState("");
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState([]);

    const [, addBookmark] = useMutation(ADD_BOOKMARK_MUTATION);
    const [, addToCategory] = useMutation(ADD_BOOKMARK_TO_CATEGORY_MUTATION);

    const clearForm = () => {
        setDisplayName("");
        setUrl("");
        setTags([]);
    };

    const submit = async () => {
        const {
            data: { insert_BOOKMARKS_one: inserted },
        } = await addBookmark({
            DISPLAY_NAME: displayName,
            URL: url,
            TAGS: tags.split(","),
        });

        await addToCategory({
            _eq: ID,
            ITEMS: [...ITEMS, inserted.ID],
        });

        clearForm();
        onSubmit();
    };
    return (
        <form>
            <label htmlFor={"display-name"} />
            <input
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                name={"display-name"}
                id={"display-name"}
            />
            <input
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                name={"url"}
                id={"url"}
            />
            <input
                onChange={(e) => setTags(e.target.value)}
                value={tags}
                name={"tags"}
                id={"tags"}
            />
            <button type="button" onClick={submit}>
                Add
            </button>
        </form>
    );
};

const BookmarkCategory = (cat) => {
    const [showAddForm, setShowAddForm] = useState(false);
    return (
        <li key={cat.ID}>
            <h2>{cat.DISPLAY_NAME}</h2>
            <ul>
                {cat.resolvedItems.map((bookmark) => {
                    return bookmark ? (
                        <Bookmark key={bookmark.ID} {...bookmark} />
                    ) : null;
                })}
            </ul>
            {showAddForm && (
                <AddBookmarkForm
                    onSubmit={() => setShowAddForm(false)}
                    category={cat}
                />
            )}
            <button onClick={() => setShowAddForm(true)}></button>
        </li>
    );
};

const Bookmarks = () => {
    const [showForm, setShowForm] = useState(false);

    const [res] = useQuery({ query: BOOKMARKS_QUERY });

    return (
        <>
            <Head>
                <title>Bookmarks</title>
            </Head>
            <ul>
                {res.fetching
                    ? "loading"
                    : sortByCategory(
                          res.data.BOOKMARKS,
                          res.data.BOOKMARK_CATEGORIES
                      ).map((cat) => {
                          return <BookmarkCategory key={cat.ID} {...cat} />;
                      })}
            </ul>
            <button onClick={() => setShowForm(true)}>+</button>
            {showForm && <AddCategoryForm />}
        </>
    );
};

export default withUrqlClient(() => hasuraClientConfig)(Bookmarks);

export async function getServerSideProps({ req }) {
    if (req.cookies.secret !== BOOKMARK_COOKIE_SECRET) {
        return {
            redirect: {
                destination: "/error"
            },
        };
    }
    return {
        props: {}, // will be passed to the page component as props
    };
}
