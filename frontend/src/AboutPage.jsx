import Button from "./Components/ButtonForLinks";
import "./AboutPage.css";

import backGroundImage from "./assets/AboutPageWallpaper.jpg";

export default function AboutPage() {
  const CompanyName = "LmaoGetFcuked";
  const backGroundImageStyle = {
    backgroundImage: `url(${backGroundImage})`,
    height: "100vh",
    fontSize: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="AboutPageContainer" style={backGroundImageStyle}>
      <p className="Header">Connect. Collaborate. Grow Together.</p>
      <p className="Paragraf">
        Welcome to {CompanyName} Connect — a social platform built exclusively
        for our team. Here, colleagues can share ideas, celebrate achievements,
        and build meaningful connections across all departments. Whether you're
        collaborating on a project or just catching up over virtual coffee,{" "}
        {CompanyName} Connect brings everyone closer, fostering a culture of
        communication, creativity, and community.
      </p>
      <Button link="/login" text="Connect to your account" />
    </div>
  );
}
