import {catnip} from "catnip";
import FILE_EARMARK_TEXT from "bootstrap-icons/icons/file-earmark-text.svg";
import BlogAdmin from "../components/BlogAdmin.jsx";
import BlogView from "../components/BlogView.jsx";
import BlogList from "../components/BlogList.jsx";

catnip.addAction("getAdminMenu",(items)=>{
	items.push({
		title: "Blogs",
		href: "/admin/blog",
		priority: 40,
		icon: FILE_EARMARK_TEXT
	});
});

catnip.addElement("BlogList",BlogList);

catnip.addRoute("admin/blog",BlogAdmin);
catnip.addRoute("blog/*",BlogView);
