import Button from "./Components/ButtonForLinks";
import "./AboutPage.css";

import backGroundImage from "./assets/AboutPageWallpaper.jpg";

export default function AboutPage() {
  const CompanyName = "VibeMedia";
  const backGroundImageStyle = {
    backgroundImage: `url(${backGroundImage})`,
    height: "100vh",
    fontSize: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="AboutPageContainer" style={backGroundImageStyle}>
      <h1 className="Header">
        <span className="header-word">Connect</span>
        <span className="header-dot">•</span>
        <span className="header-word">Collaborate</span>
        <span className="header-dot">•</span>
        <span className="header-word">Grow Together</span>
      </h1>
      <div className="Paragraf">
        <p className="intro-text">
          Welcome to <span className="company-highlight">{CompanyName} Connect</span>
        </p>
        <p className="main-text">
          A social platform built exclusively for our team. Here, colleagues can <span className="text-highlight">share ideas</span>, <span className="text-highlight">celebrate achievements</span>, and build <span className="text-highlight">meaningful connections</span> across all departments.
        </p>
        <p className="closing-text">
          Whether you're collaborating on a project or just catching up over virtual coffee, <strong>{CompanyName} Connect</strong> brings everyone closer, fostering a culture of communication, creativity, and community.
        </p>
      </div>
      <Button link="/login" text="Connect to your account" />
    </div>
  );
}
