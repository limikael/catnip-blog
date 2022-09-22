import {catnip, A, ItemList, setLocation, buildUrl, BsAlert, BsLoader, useForm,
		useApiFetch, apiFetch, useCounter, useValueChanged, useChannel, PromiseButton, usePromise} from "catnip";
import {BsInput} from "catnip";
import {useState, useContext} from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

function BlogEdit({request}) {
	let [message, setMessage]=useState();
	let form=useForm({
		initial: async ()=>{
			if (!request.query.id)
				return {};

			return await apiFetch("/api/blog/get",{id: request.query.id});
		},
		deps: [request.query.id]
	});

	async function write() {
		setMessage();
		try {
			let saved=await apiFetch("/api/blog/save",form.getCurrent());
			setLocation(buildUrl("/admin/blog",{id: saved.id}));
			form.setCurrent(saved);
			setMessage("Saved...");
		}

		catch (e) {
			setMessage(e);
		}
	}

	function BlogLink({blog}) {
		if (!blog.slug)
			return;

		let url=window.location.origin+"/blog/"+blog.slug;
		return (
			<div class="form-text mt-1">
				<b>Permalink:</b> <A href={url}>{url}</A>
			</div>
		);
	}

	return (<>
		<h1 class="mb-3">{request.query.id?"Edit Blog Entry":"Add New Blog Entry"}</h1>
		<BsAlert message={message} ondismiss={setMessage}/>
		<BsLoader resource={form.getCurrent()}>
			<div class="container-fluid border rounded p-3 bg-light">
				<div class="mb-3">
					<BsInput {...form.field("title")} placeholder="Blog Title"/>
					<BlogLink blog={form.getCurrent()}/>
				</div>
				<BsInput class="font-monospace mb-3" rows={10} type="textarea" {...form.field("content")} />
				<PromiseButton class="btn btn-primary" onclick={write}>
					{request.query.id?"Update Blog Entry":"Create New Blog Entry"}
				</PromiseButton>
			</div>
		</BsLoader>
	</>);
}

function BlogAdminList({request}) {
	function formatStamp(item) {
		return dayjs.unix(item.stamp).from(dayjs());
	}

	let columns={
		title: {label: "Title"},
		stamp: {label: "Date", cb: formatStamp}
	};

	async function getBlogs() {
		return await apiFetch("/api/blog/list");
	}

	async function onDelete(id) {
		await apiFetch("/api/blog/delete",{id: id});
		return "Blog entry deleted.";
	}

	return (
		<>
			<div>
				<h1 class="d-inline-block mb-3">Blog Entries</h1>
				<A class="btn btn-outline-primary align-text-bottom ms-2 btn-sm"
						href="/admin/blog?new=1">
					Add Blog Entry
				</A>
			</div>
			<ItemList
					items={getBlogs} 
					columns={columns}
					href="/admin/blog"
					ondelete={onDelete}/>
		</>
	);
}

export default function BlogAdmin({request}) {
	if (request.query.id || request.query.new)
		return <BlogEdit request={request}/>

	return <BlogAdminList request={request}/>
}
