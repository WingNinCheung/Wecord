import React from "react";
import "./splash.css";

export default function Splash() {
  return (
    <div className="splash-container">
      <div id="splash-wrapper">
        <div id="background-partition">
          <h1 id="splash-title">Imagine a place...</h1>
          <p id="splash-intro">
            ...where you can belong to any school club, any gaming group, or a
            worldwide art community.
            <div></div>
            <br />
            Where just you and anyone can spend time together.
            <div></div>
            <br />A place where strangers can become acquaintances...or maybe
            even friends.
          </p>
        </div>
      </div>
      <div className="footer">
        <section className="dev-info">
          <div>Ricky Cheung</div>
          <div>
            <i class="fa-brands fa-github"></i>
          </div>
        </section>
        <section className="dev-info">
          <div>Krista Strucke</div>
          <div>
            <i class="fa-brands fa-github"></i>
          </div>
        </section>
        <section className="dev-info">
          <div>Brendan Lau</div>
          <div>
            <i class="fa-brands fa-github"></i>
          </div>
        </section>
        <section className="dev-info">
          <div>Qiaoyi Liu </div>
          <div>
            <i class="fa-brands fa-github"></i>
          </div>
        </section>
      </div>
    </div>
  );
}
