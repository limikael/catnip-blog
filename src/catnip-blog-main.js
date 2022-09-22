import {catnip, Model, convertToSlug} from "catnip";

export default class Blog extends Model {
	static tableName="Blog";
	static fields={
		id: "INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY",
		title: "TEXT NOT NULL",
		stamp: "INTEGER NOT NULL",
		content: "TEXT NOT NULL",
		slug: "VARCHAR(255) NOT NULL"
	};
}

catnip.addModel(Blog);
catnip.createCrudApi(Blog,{
	cap: "manage-content",
	onsave: (item)=>{
		item.stamp=Date.now()/1000;
		item.slug=convertToSlug(item.title);
	}
});

catnip.addApi("/api/getBlogView",async ({query})=>{
	let blog=await catnip.db.Blog.findOne({
		$op: "or",
		slug: query,
		id: query
	});

	if (!blog)
		throw new Error("NOT FOUND")

	return blog;
})

catnip.addApi("/api/getBlogList",async ({query})=>{
	let blogs=await catnip.db.Blog.findMany();

	if (!blogs)
		throw new Error("NOT FOUND")

	return blogs;
})
