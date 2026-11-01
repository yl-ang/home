import React, { useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  navBar,
  mainBody,
  about,
  blog,
  projects,
  leadership,
  getInTouch
} from "./editable-stuff/config.js";
import MainBody from "./components/home/MainBody";
import AboutMe from "./components/home/AboutMe";
import Project from "./components/home/Project";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Blog } from "./components/blog/Blog";
import BlogPost from "./components/blog/BlogPost";
import GetInTouch from "./components/home/GetInTouch.jsx";
import Leadership from "./components/home/Leadership.jsx";
import SiteBackground from "./components/background/SiteBackground";
import Minesweeper from "./components/minesweeper/Minesweeper";
import Klotski from "./components/klotski/Klotski";
import Frogger from "./components/frogger/Frogger";

const Home = React.forwardRef((props, ref) => {
  return (
    <>
      <SiteBackground />
      <MainBody
        title={`${mainBody.firstName} ${mainBody.middleName} ${mainBody.lastName}`}
        message={mainBody.message}
        icons={mainBody.icons}
        ref={ref} // Make sure ref is forwarded properly
      />
      <div className="bg-white position-relative">
        {about.show && (
          <AboutMe
            heading={about.heading}
            link={about.imageLink}
          />
        )}
        {blog.show && <Blog heading={Blog.heading} message={Blog.message} email={Blog.email} />}
        {projects.show && (
          <Project heading={projects.heading} message={projects.message} projects={projects.projects} />
        )}
        {leadership.show && (
          <Leadership
            heading={leadership.heading}
            message={leadership.message}
            img={leadership.images}
            imageSize={leadership.imageSize}
          />
        )}
      </div>
    </>
  );
});

const App = () => {
  const titleRef = useRef();

  return (
  <BrowserRouter basename="/home">
      {navBar.show && <Navbar ref={titleRef} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
      </Routes>
      <Footer>
        {getInTouch.show && <GetInTouch />}
      </Footer>
      <Minesweeper />
      <Klotski />
      <Frogger />
    </BrowserRouter>
  );
};

export default App;