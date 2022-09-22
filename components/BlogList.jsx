import {useApiFetch, BsLoader, A} from "catnip";
import dayjs from "dayjs";

import XMLToReactModule from 'xml-to-react';

const XMLToReact=XMLToReactModule.default;

function renderXml(content) {
	let tags=["h1","h2","h3","h4","h5","div","span","b","p","hr","small","br"];
	let options={};

	for (let tag of tags)
		options[tag]=(attrs)=>({type: "span", props: attrs});

	options["Fragment"]=(attrs)=>({type: Fragment, props: attrs});

	options["a"]=(attrs)=>({type: A, props: attrs});

	for (elementName in catnip.elements) {
		let elementFunc=catnip.elements[elementName];
		options[elementName]=(attrs)=>({type: elementFunc, props: attrs});
	}

	const xmlToReact=new XMLToReact(options);
	return xmlToReact.convert(`<Fragment>${content}</Fragment>`);
}

export default function BlogList({...props}) {
	let blogList=useApiFetch("/api/getBlogList");

	let blogListContent=[];
	if (Array.isArray(blogList)) {
		for (let blog of blogList) {
			let url=window.location.origin+"/blog/"+blog.slug;

			blogListContent.push(
				<div class="col-12 col-md-6">
					<div class="card border-primary mb-3">
						<div class="card-header">{dayjs.unix(blog.stamp).format("D MMM, YYYY")}</div>
						<div class="card-body">
							<h4 class="card-title">{blog.title}</h4>
							<p class="card-text"
									style="max-height: 3em; overflow: hidden; text-overflow: ellipsis;">
								{renderXml(blog.content)}
							</p>
							<A href={url} class="btn btn-primary stretched-link">More...</A>
						</div>
					</div>
				</div>
			);
		}
	}

	return (
		<BsLoader resource={blogList}>
			<div class="row my-3">
				{blogListContent}
			</div>
		</BsLoader>
	);
}