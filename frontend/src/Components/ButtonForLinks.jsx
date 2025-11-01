import React from "react";
import { Link } from "react-router-dom";
import "./ButtonForLinks.css";

export default function Button(props) {
  const { link, text } = props;
  return (
    <div className="buttonContainer">
      <Link to={link} className="button">
        {text}
      </Link>
    </div>
  );
}
