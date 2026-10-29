import React, { Fragment } from "react";

class BlogBuilder {
  list = [];

  constructor({ title, image, description }) {
    this.title = title;
    this.image = image;
    this.description = description;
  }

  addParagraph = (props) => {
    this.list.push(
      <p key={this.list.length} className="lead">
        {props}
      </p>
    );
    return this;
  };

  addHeading = (props) => {
    this.list.push(
      <Fragment key={this.list.length}>
        <h1 className="">{props}</h1>
        <hr />
      </Fragment>
    );
    return this;
  };

  addImage = (src, alt) => {
    this.list.push(
      <img
        key={this.list.length}
        className="img-fluid d-block mx-auto mb-4"
        src={src}
        alt={alt}
      />
    );
    return this;
  };

  addList = (items) => {
    this.list.push(
      <ul key={this.list.length} className="lead">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
    return this;
  };

  getBlog = () => {
    return <div className="container-lg">{this.list}</div>;
  };
}

export { BlogBuilder };
