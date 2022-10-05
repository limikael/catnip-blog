import {katnip, A, ItemList, setLocation, buildUrl, useApiFetch, apiFetch, renderElementContent} from "katnip";
import {useState, useContext} from "react";

export default function BlogView({request}) {
	let tc=katnip.useTemplateContext();
	let blogQuery=request.pathargs[1];
	let blog=useApiFetch("/api/getBlogView",{query: blogQuery},[blogQuery]);

	if (!blog)
		return;

	if (blog instanceof Error)
		return <div class="mt-5"><BsAlert message={blog}/></div>;

	tc.set({title: blog.title});

	return renderElementContent(blog.content);
}