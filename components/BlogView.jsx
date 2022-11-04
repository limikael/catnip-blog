import {setTemplateContext, useApiFetch, renderFragment} from "katnip";
import {useState, useContext} from "react";

export default function BlogView({request}) {
	let blogQuery=request.pathargs[1];
	let blog=useApiFetch("/api/getBlogView",{query: blogQuery},[blogQuery]);

	if (!blog)
		return;

	if (blog instanceof Error)
		return <div class="mt-5"><BsAlert message={blog}/></div>;

	setTemplateContext("title",blog.title);

	return renderFragment(blog.content);
}