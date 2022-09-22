import {catnip, A, ItemList, setLocation, buildUrl, useApiFetch, apiFetch} from "catnip";
import {useState, useContext} from "react";
import XMLToReactModule from 'xml-to-react';

const XMLToReact=XMLToReactModule.default;

function renderXml(content) {
	let tags=["h1","h2","h3","h4","h5","div","span","b","p","hr","small","br","ul","li"];
	let options={};

	for (let tag of tags)
		options[tag]=(attrs)=>({type: tag, props: attrs});

	options["Fragment"]=(attrs)=>({type: Fragment, props: attrs});

	options["a"]=(attrs)=>({type: A, props: attrs});

	for (elementName in catnip.elements) {
		let elementFunc=catnip.elements[elementName];
		options[elementName]=(attrs)=>({type: elementFunc, props: attrs});
	}

	const xmlToReact=new XMLToReact(options);
	return xmlToReact.convert(`<Fragment>${content}</Fragment>`);
}

export default function BlogView({request}) {
	let tc=catnip.useTemplateContext();
	let blogQuery=request.pathargs[1];
	let blog=useApiFetch("/api/getBlogView",{query: blogQuery},[blogQuery]);

	if (!blog)
		return;

	if (blog instanceof Error)
		return <div class="mt-5"><BsAlert message={blog}/></div>;

	tc.setTitle(blog.title);

	return renderXml(blog.content);
}