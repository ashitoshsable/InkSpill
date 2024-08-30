import { NavBar } from "../components/NavBar"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return <div>
            <NavBar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <>
    <div>
        <NavBar />
        <div  className="flex justify-center">
             <div>
                 {blogs.map(blog => <BlogCard
                     id={blog.id}
                     authorName={blog.author.name || "Anonymous"}
                     title={blog.title}
                     content={blog.content}
                     publishedDate={"2nd Feb 2024"}
                 />)}
                 {/* <BlogCard id="2" authorName="Ashitosh Sable" title="Hello World" content="Hello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello World" publishedDate="2-4-28" /> */}
             </div>
         </div>
    </div>
    </>
}
