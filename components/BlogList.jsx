import {useApiFetch, bsLoader, A, renderFragment} from "katnip";
import dayjs from "dayjs";

export default function BlogList({renderMode, outer, inner, num}) {
	let blogList=useApiFetch("/api/getBlogList");

	function onClick(ev) {
		if (renderMode=="editor") {
			ev.preventDefault();
			return false;
		}
	}

	num=Number(num);

	let blogListContent=[];
	if (Array.isArray(blogList)) {
		let numBlogs=blogList.length;
		if (num && numBlogs>num)
			numBlogs=num;

		for (let i=0; i<numBlogs; i++) {
			let blog=blogList[i];
			let url="/blog/"+blog.slug;

			blogListContent.push(
				<div class="col-12 col-md-6">
					<div class="card border-primary mb-3">
						<div class="card-header">{dayjs.unix(blog.stamp).format("D MMM, YYYY")}</div>
						<div class="card-body">
							<h4 class="card-title">{blog.title}</h4>
							<p class="card-text"
									style="max-height: 3em; overflow: hidden; text-overflow: ellipsis;">
								{blog.excerpt}
							</p>
							<A href={url} class="btn btn-primary stretched-link" onclick={onClick}>More...</A>
						</div>
					</div>
				</div>
			);
		}
	}

	return (
		<div {...outer}>
			{bsLoader(blogList,()=><>
				<div class="row my-3">
					{blogListContent}
				</div>
			</>)}
		</div>
	);
}

BlogList.controls={
	num: {title: "Number of entries"}
}