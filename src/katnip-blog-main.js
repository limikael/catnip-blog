import {katnip, Model, convertToSlug, renderContentExcerpt} from "katnip";

export default class Blog extends Model {
	static tableName="Blog";
	static fields={
		id: "INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY",
		title: "TEXT NOT NULL",
		stamp: "INTEGER NOT NULL",
		content: "JSON NOT NULL",
		slug: "VARCHAR(255) NOT NULL",
		status: "VARCHAR(64) DEFAULT ''",
		draftCode: "VARCHAR(64) DEFAULT ''",
	};
}

katnip.addModel(Blog);
katnip.createCrudApi(Blog,{
	cap: "manage-content",
	onsave: (item)=>{
		if (!item.stamp)
			item.stamp=Date.now()/1000;

		if (!item.draftCode) {
			item.draftCode="";
			let chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for (let i=0; i<8; i++)
				item.draftCode+=chars.charAt(Math.floor(Math.random()*chars.length));
		}

		item.slug=convertToSlug(item.title);
	}
});

katnip.addApi("/api/getBlogView",async ({query, code})=>{
	let blog=await katnip.db.Blog.findOne({
		$op: "or",
		slug: query,
		id: query
	});

	if (blog.status=="draft" && code!=blog.draftCode)
		throw new Error("NOT PUBLISHED");

	if (!blog)
		throw new Error("NOT FOUND")

	return blog;
})

katnip.addApi("/api/getBlogList",async ({query})=>{
	let blogs=await katnip.db.Blog.findMany({
		"status<>":"draft",
		$order: "stamp desc"
	});

	if (!blogs)
		throw new Error("NOT FOUND")

	for (let blog of blogs)
		blog.excerpt=renderContentExcerpt(blog.content,200);

	return blogs;
})
