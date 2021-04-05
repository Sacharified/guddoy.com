import { addBookmark } from "api/features/bookmarks";

const postHandler = async(req, { url }) => {
	const { data: { insert_BOOKMARKS_one: inserted} } = await addBookmark(url);
	return inserted;
};

const handlers = {
	"POST": postHandler
};

const handler = async (req, res) => {
	const handle = handlers[req.method];
	let data = {};
	console.log(req)
	if (req.body) {
		data = JSON.parse(req.body)
	}
	const response = await handle(req, data);
	res.status(200).json(response)
}

export default handler;