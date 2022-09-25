import {katnip} from "katnip";
import FILE_EARMARK_TEXT from "bootstrap-icons/icons/file-earmark-text.svg";
import BlogAdmin from "../components/BlogAdmin.jsx";
import BlogView from "../components/BlogView.jsx";
import BlogList from "../components/BlogList.jsx";

katnip.addAction("getAdminMenu",(items)=>{
	items.push({
		title: "Blogs",
		href: "/admin/blog",
		priority: 40,
		icon: FILE_EARMARK_TEXT
	});
});

katnip.addElement("BlogList",BlogList);

katnip.addRoute("admin/blog",BlogAdmin);
katnip.addRoute("blog/*",BlogView);
