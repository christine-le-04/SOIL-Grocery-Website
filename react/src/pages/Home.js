import React from "react";
import Header from "../fragments/Header";
import Content from "../fragments/Content";

export default function Home(props) {
  return (
    <div className="text-center">
      <Header />
      {props.user !== null && <h4><strong>
        <br></br><br></br><br></br>
        <span class="material-icons">face</span> 
        Welcome {props.user.username}!</strong></h4>}

      <br></br>
      
      <Content />
      <br></br>
    </div>
  );
}
