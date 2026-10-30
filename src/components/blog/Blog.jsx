import React from "react";
import { BlogBuilder } from "./BlogBuilder";
import bloglist from "../../editable-stuff/blog";
import { Link } from "react-router-dom";
import "./Blog.css";

const Blog = () => {
  const first = bloglist[0];
  return (
    <section id="blogs" className="blogs" aria-labelledby="blogs-heading">
      <div className="blogs__inner">
        <p className="blogs__label">// blogs/</p>
        <h2 id="blogs-heading" className="blogs__heading">Blogs</h2>
        <p className="blogs__sub">
          Notes from things I have built, studied and broken along the way.
        </p>

        <ul className="blogs__grid">
          {bloglist.map((post, index) => (
            <li key={post.slug || index}>
              <BlogCard post={post} index={index} />
            </li>
          ))}
        </ul>

        {first && first.slug && (
          <p className="blogs__tip">
            tip: in the About terminal, <code>cat blogs/{first.slug}.md</code> prints the
            same summary.
          </p>
        )}
      </div>
    </section>
  );
};

// The Read link is stretched over the whole card (see .blogs__read::after),
// so the card has one tab stop and one accessible name.
const BlogCard = ({ post, index }) => (
  <article className="blogs__card">
    <p className="blogs__path">
      <span className="blogs__dot" aria-hidden="true" />
      ~/blogs/{post.slug}.md
    </p>
    <h3 className="blogs__title">{post.title}</h3>
    <p className="blogs__desc">{post.description}</p>
    <ul className="blogs__tags" aria-label="Tags">
      {(post.tags || []).map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
    <Link to={`/blog/${index}`} className="blogs__read" aria-label={`Read: ${post.title}`}>
      Read <span aria-hidden="true">→</span>
    </Link>
  </article>
);

export { Blog, BlogBuilder };
