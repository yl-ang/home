import React from "react";
import { useParams } from "react-router-dom";
import bloglist from "../../editable-stuff/blog";

const BlogPost = () => {
  const { id } = useParams();
  const post = bloglist[id];

  return (
    <div className="container-lg mt-5">
      {post ? (
        <div>
          <img className="img-fluid mb-2 d-block mx-auto" src={post.image} alt={post.title} />
          {/* <h1 className="display-3 text-center">{post.title}</h1> */}
          {post.getBlog()}
        </div>
      ) : (
        <h1 className="display-1 text-center">404 - Page not found</h1>
      )}
    </div>
  );
};

export default BlogPost;