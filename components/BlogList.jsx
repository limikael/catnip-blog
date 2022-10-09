import {useApiFetch, BsLoader, A, renderFragment} from "katnip";
import dayjs from "dayjs";

export default function BlogList({renderMode, outer, inner}) {
	let blogList=useApiFetch("/api/getBlogList");

	function onClick(ev) {
		if (renderMode=="editor") {
			ev.preventDefault();
			return false;
		}
	}

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
								hello...
								{renderFragment(blog.content)}
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
			<BsLoader resource={blogList}>
				<div class="row my-3">
					{blogListContent}
				</div>
			</BsLoader>
		</div>
	);
}