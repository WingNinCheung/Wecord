import React from "react";
import "./splash.css";

export default function Splash() {
  return (
    <div className="splash-container">
      <div className="background-partition">
        <h1 id="splash-title">Imagine a place...</h1>
        <p id="splash-intro">
          ...where you can belong to any school club, any gaming group, or a
          worldwide art community.
          <div></div>
          <br />
          Where just you and anyone can spend time together.
          <div></div>
          <br />A place where strangers can become acquaintances...or maybe even
          friends.
        </p>
      </div>
      <div className="footer">
        <section className="dev-info">
          <img
            className="profile-pic"
            src="https://media-exp1.licdn.com/dms/image/C5603AQGWk2Gqsts5JA/profile-displayphoto-shrink_800_800/0/1563818007698?e=1664409600&v=beta&t=vVd1pvvenK9aSpDCYrZI9CSI6NZHXnAa4b6rjRPlnUk"
            alt="Ricky"
          ></img>
          <div className="profile-section">
            <div className="name">Ricky Cheung</div>

            <div className="git-in">
              <a href="https://github.com/WingNinCheung" target="popup">
                <i class="fa-brands fa-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/wingnincheung/"
                target="popup"
              >
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="mailto:wingnin.cheung415@gmail.com">
                <i class="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>
        </section>
        <section className="dev-info">
          {/* <img className="profile-pic" src="" alt="Krista"></img> */}
          <div className="profile-section">
            <div className="name">Krista Strucke</div>

            <div className="git-in">
              <a href="" target="popup">
                <i class="fa-brands fa-github"></i>
              </a>
              <a href="" target="popup">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="">
                <i class="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>
        </section>
        <section className="dev-info">
          {/* <img
            className="profile-pic"
            src=""
            alt="Brendan"
          ></img> */}
          <div className="profile-section">
            <div className="name">Brendan Lau</div>

            <div className="git-in">
              <a href="" target="popup">
                <i class="fa-brands fa-github"></i>
              </a>
              <a href="" target="popup">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="">
                <i class="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>
        </section>
        <section className="dev-info">
          {/* <img
            className="profile-pic"
            src=""
            alt="Joyce"
          ></img> */}
          <div className="profile-section">
            <div className="name">Qiaoyi Lau</div>

            <div className="git-in">
              <a href="" target="popup">
                <i class="fa-brands fa-github"></i>
              </a>
              <a href="" target="popup">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="">
                <i class="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
