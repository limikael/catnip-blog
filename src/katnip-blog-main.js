import {katnip, Model, convertToSlug} from "katnip";

export default class Blog extends Model {
	static tableName="Blog";
	static fields={
		id: "INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY",
		title: "TEXT NOT NULL",
		stamp: "INTEGER NOT NULL",
		content: "JSON NOT NULL",
		slug: "VARCHAR(255) NOT NULL"
	};
}

katnip.addModel(Blog);
katnip.createCrudApi(Blog,{
	cap: "manage-content",
	onsave: (item)=>{
		item.stamp=Date.now()/1000;
		item.slug=convertToSlug(item.title);
	}
});

katnip.addApi("/api/getBlogView",async ({query})=>{
	let blog=await katnip.db.Blog.findOne({
		$op: "or",
		slug: query,
		id: query
	});

	if (!blog)
		throw new Error("NOT FOUND")

	return blog;
})

katnip.addApi("/api/getBlogList",async ({query})=>{
	let blogs=await katnip.db.Blog.findMany();

	if (!blogs)
		throw new Error("NOT FOUND")

	return blogs;
})
