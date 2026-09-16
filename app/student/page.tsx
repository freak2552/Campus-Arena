"use client";

import Link from "next/link";

export default function StudentHome() {
  return (
    <main className="student-page">
      {/* Background decoration */}
      <div className="sky-glow sky-left" />
      <div className="sky-glow sky-right" />

      {/* HEADER */}
      <header className="top-header">
        <div className="brand">
          <div className="brand-name">
            Campus<span>Arena</span>
          </div>
          <div className="brand-tagline">
            Learn&nbsp; • &nbsp;Compete&nbsp; • &nbsp;Connect&nbsp; • &nbsp;Grow
          </div>
        </div>

        <div className="profile-area">
          <div className="notification">
            ♧
            <span>2</span>
          </div>

          <div className="avatar">RK</div>

          <div className="profile-text">
            <strong>Ritesh Kumar</strong>
            <small>Student&nbsp; • &nbsp;IT Sem 5</small>
          </div>

          <div className="chevron">⌄</div>
        </div>
      </header>

      {/* MAIN */}
      <section className="hero">
        <p className="greeting">Good evening, Ritesh! 👋</p>

        <h1>What do you want to do today?</h1>

        <p className="subtitle">
          Choose a path and make progress.
        </p>
      </section>

      {/* CARDS */}
      <section className="cards">

        {/* COMPETE */}
        <Link href="/student/compete" className="arena-card compete">
          <div className="card-icon">🏆</div>

          <h2>Compete</h2>

          <p className="card-description">
            Test your knowledge. Challenge
            <br />
            yourself. Climb the leaderboard.
          </p>

          <div className="divider" />

          <ul>
            <li>
              <span>♧</span> Quizzes
            </li>
            <li>
              <span>▣</span> Exams
            </li>
            <li>
              <span>🏆</span> Tournaments
            </li>
            <li>
              <span>♟</span> Leaderboards & Badges
            </li>
          </ul>

          <div className="enter-button">
            Enter Compete
            <b>→</b>
          </div>
        </Link>

        {/* PEER TO PEER */}
        <Link
          href="/student/peer-to-peer"
          className="arena-card peer"
        >
          <div className="card-icon">👥</div>

          <h2>Peer-to-Peer</h2>

          <p className="card-description">
            Learn together. Help each other.
            <br />
            Grow as a community.
          </p>

          <div className="divider" />

          <ul>
            <li>
              <span>♧</span> Find or offer help
            </li>
            <li>
              <span>◉</span> Meet on campus
            </li>
            <li>
              <span>♟</span> Earn XP & build your profile
            </li>
            <li>
              <span>●</span> Be a part of a supportive community
            </li>
          </ul>

          <div className="enter-button">
            Enter Peer-to-Peer
            <b>→</b>
          </div>
        </Link>

        {/* DISCOVER */}
        <Link
          href="/student/discover"
          className="arena-card discover"
        >
          <div className="card-icon">◈</div>

          <h2>Discover</h2>

          <p className="card-description">
            Explore opportunities. Stay updated.
            <br />
            Get inspired.
          </p>

          <div className="divider" />

          <ul>
            <li>
              <span>▣</span> Career opportunities
            </li>
            <li>
              <span>♟</span> Useful resources
            </li>
            <li>
              <span>↟</span> Tech & industry updates
            </li>
            <li>
              <span>★</span> Student achievements
            </li>
          </ul>

          <div className="enter-button">
            Enter Discover
            <b>→</b>
          </div>
        </Link>
      </section>

      {/* MY LEARNING */}
      <Link href="/student/learning" className="learning-card">
        <div className="book-icon">▣</div>

        <div className="learning-text">
          <h3>My Learning</h3>
          <p>
            Access your courses, notes, assignments and track your progress.
          </p>
        </div>

        <div className="courses-button">
          View My Courses
          <b>→</b>
        </div>
      </Link>

      {/* BOTTOM */}
      <div className="bottom-area">

        <div className="quote quote-left">
          “A better you
          <br />
          builds a brighter tomorrow.”
          <div className="underline" />
        </div>

        <div className="quote quote-right">
          Same Campus
          <br />
          Bigger Possibilities
          <div className="yellow-line" />
        </div>

        <div className="bottom-features">
          <div>
            <span>♙</span>
            For Students
          </div>

          <i />

          <div>
            <span>◇</span>
            By Our College
          </div>

          <i />

          <div>
            <span>▮▮▮</span>
            For A Brighter Future
          </div>
        </div>

      </div>

      {/* CAMPUS ILLUSTRATION
      <div className="campus-art">
        <div className="building building-one" />
        <div className="building building-two" />
        <div className="tree tree-one">🌳</div>
        <div className="tree tree-two">🌳</div>
        <div className="student-art">🎒</div>
      </div> */}

      <div className="side-sign">
        LEARN
        <br />
        SHARE
        <br />
        COMPETE
        <br />
        GROW
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f9fcff;
        }

        .student-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background-image: url("/images/student_main-home_bg_pc.png");
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          background-attachment: scroll;
          color: #111735;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          padding: 22px 7.5% 60px;
        }

        .sky-glow {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }

        .sky-left {
          left: -300px;
          top: 180px;
          background: rgba(88, 180, 255, 0.12);
        }

        .sky-right {
          right: -300px;
          top: 250px;
          background: rgba(88, 180, 255, 0.12);
        }

        /* HEADER */

        .top-header {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1370px;
          margin: 0 auto;
        }

        .brand-name {
          font-size: 38px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -2px;
          color: #10152f;
        }

        .brand-name span {
          color: #1164db;
        }

        .brand-tagline {
          margin-top: 8px;
          color: #596887;
          font-size: 16px;
        }

        .profile-area {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .notification {
          position: relative;
          font-size: 31px;
          transform: rotate(180deg);
          margin-right: 20px;
        }

        .notification span {
          position: absolute;
          top: -4px;
          right: -8px;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #ef2d36;
          color: white;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(180deg);
          font-weight: 700;
        }

        .avatar {
          width: 51px;
          height: 51px;
          border-radius: 50%;
          background: linear-gradient(145deg, #222d43, #111827);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          border: 3px solid white;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
        }

        .profile-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .profile-text strong {
          font-size: 15px;
        }

        .profile-text small {
          font-size: 14px;
          color: #687695;
        }

        .chevron {
          font-size: 30px;
          margin-left: 20px;
          transform: translateY(-4px);
        }

        /* HERO */

        .hero {
          position: relative;
          z-index: 5;
          text-align: center;
          margin: 26px auto 18px;
        }

        .greeting {
          margin: 0 0 9px;
          color: #344267;
          font-size: 21px;
        }

        .hero h1 {
          margin: 0;
          font-size: 45px;
          line-height: 1.15;
          letter-spacing: -1.8px;
          font-weight: 800;
        }

        .subtitle {
          margin: 8px 0 0;
          font-size: 20px;
          color: #5a6788;
        }

        /* CARDS */

        .cards {
          position: relative;
          z-index: 6;
          max-width: 1275px;
          margin: 18px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .arena-card {
          min-height: 454px;
          padding: 25px 29px 20px;
          border-radius: 20px;
          text-decoration: none;
          color: #101735;
          border: 1px solid;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .arena-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 35px rgba(35, 65, 110, 0.1);
        }

        .compete {
          background: linear-gradient(
            145deg,
            rgba(255, 251, 236, 0.95),
            rgba(255, 248, 220, 0.9)
          );
          border-color: #f4df9e;
        }

        .peer {
          background: linear-gradient(
            145deg,
            rgba(239, 253, 247, 0.98),
            rgba(229, 250, 242, 0.95)
          );
          border-color: #b8eddc;
        }

        .discover {
          background: linear-gradient(
            145deg,
            rgba(242, 249, 255, 0.98),
            rgba(228, 243, 255, 0.95)
          );
          border-color: #b9dafe;
        }

        .card-icon {
          width: 84px;
          height: 84px;
          border-radius: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 39px;
          margin-bottom: 11px;
        }

        .compete .card-icon {
          background: linear-gradient(145deg, #ffb615, #ff9f00);
        }

        .peer .card-icon {
          background: linear-gradient(145deg, #0caf72, #00a66a);
        }

        .discover .card-icon {
          background: linear-gradient(145deg, #2f8cf4, #116fe5);
        }

        .arena-card h2 {
          margin: 0;
          font-size: 30px;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .card-description {
          margin: 5px 0 0;
          font-size: 18px;
          line-height: 1.4;
          color: #48587d;
        }

        .divider {
          height: 1px;
          background: rgba(47, 66, 98, 0.14);
          margin: 17px 0 11px;
        }

        .arena-card ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .arena-card li {
          display: flex;
          align-items: center;
          gap: 13px;
          font-size: 16px;
          color: #243253;
        }

        .arena-card li span {
          width: 25px;
          text-align: center;
          font-size: 18px;
        }

        .compete li span {
          color: #f5a900;
        }

        .peer li span {
          color: #00a56b;
        }

        .discover li span {
          color: #1673e5;
        }

        .enter-button {
          position: absolute;
          bottom: 19px;
          left: 28px;
          right: 28px;
          height: 53px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 25px;
          font-weight: 700;
          font-size: 17px;
        }

        .compete .enter-button {
          background: linear-gradient(90deg, #ffd432, #ffc21d);
          color: #101010;
        }

        .peer .enter-button {
          background: linear-gradient(90deg, #36d99b, #23cf90);
          color: #062b1d;
        }

        .discover .enter-button {
          background: linear-gradient(90deg, #348cf1, #1874e9);
          color: white;
        }

        .enter-button b {
          font-size: 28px;
          font-weight: 400;
        }

        /* LEARNING */

        .learning-card {
          position: relative;
          z-index: 7;
          max-width: 994px;
          min-height: 91px;
          margin: 29px calc((100% - 1275px) / 2) 0;
          padding: 14px 25px;
          border: 1px solid #dce7f4;
          border-radius: 19px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 5px 20px rgba(40, 75, 120, 0.05);
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #101735;
        }

        .book-icon {
          width: 69px;
          height: 58px;
          border-radius: 15px;
          background: #eaf3ff;
          border: 1px solid #cbdff7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #17355e;
          font-size: 29px;
        }

        .learning-text {
          margin-left: 19px;
        }

        .learning-text h3 {
          margin: 0;
          font-size: 21px;
        }

        .learning-text p {
          margin: 4px 0 0;
          font-size: 16px;
          color: #566584;
        }

        .courses-button {
          margin-left: auto;
          padding: 13px 22px;
          border: 1px solid #d1e1f6;
          border-radius: 25px;
          background: #f4f8fd;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }

        .courses-button b {
          font-size: 22px;
          margin-left: 14px;
          font-weight: 400;
        }

        /* BOTTOM */

        .bottom-area {
          position: relative;
          z-index: 8;
          max-width: 1370px;
          margin: 40px auto 0;
          min-height: 100px;
        }

        .quote {
          position: absolute;
          font-family: "Comic Sans MS", "Segoe Print", cursive;
          font-size: 17px;
          line-height: 1.4;
          color: #25345e;
        }

        .quote-left {
          left: -10px;
          bottom: 0;
          transform: rotate(-3deg);
        }

        .quote-right {
          right: 0;
          top: -5px;
          text-align: center;
          transform: rotate(-5deg);
        }

        .underline {
          width: 70px;
          height: 3px;
          background: #f4b900;
          margin-top: 7px;
          transform: rotate(-7deg);
        }

        .yellow-line {
          width: 75px;
          height: 3px;
          background: #f4b900;
          margin: 7px auto 0;
          transform: rotate(-4deg);
        }

        .bottom-features {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 29px;
          color: #506083;
          font-size: 14px;
          padding-top: 36px;
        }

        .bottom-features div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bottom-features span {
          color: #101735;
          font-size: 26px;
          font-weight: 700;
        }

        .bottom-features i {
          width: 1px;
          height: 35px;
          background: #aebbd0;
        }

        /* SIMPLE CAMPUS ART */

        .campus-art {
          position: absolute;
          right: -20px;
          bottom: -10px;
          width: 430px;
          height: 300px;
          pointer-events: none;
          opacity: 0.85;
        }

        .building {
          position: absolute;
          bottom: 0;
          background: linear-gradient(145deg, #d8e8f5, #b8cee1);
          border: 1px solid #aac1d4;
        }

        .building-one {
          right: 55px;
          width: 235px;
          height: 150px;
          clip-path: polygon(15% 0, 100% 10%, 100% 100%, 0 100%, 0 20%);
        }

        .building-two {
          right: 180px;
          width: 130px;
          height: 105px;
          bottom: 0;
        }

        .tree {
          position: absolute;
          font-size: 75px;
          filter: saturate(0.75);
        }

        .tree-one {
          right: 300px;
          bottom: 55px;
        }

        .tree-two {
          right: -10px;
          bottom: 45px;
          font-size: 90px;
        }

        .student-art {
          position: absolute;
          right: 105px;
          bottom: -10px;
          font-size: 135px;
          z-index: 3;
        }

        .side-sign {
          position: absolute;
          right: 10px;
          bottom: 150px;
          padding: 13px 8px;
          color: #52627e;
          font-weight: 700;
          font-size: 15px;
          line-height: 1.25;
          text-align: center;
          transform: rotate(-2deg);
          background: rgba(255, 255, 255, 0.45);
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .student-page {
            padding-left: 4%;
            padding-right: 4%;
          }

          .cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .discover {
            grid-column: span 2;
          }

          .learning-card {
            margin-left: 0;
            margin-right: 0;
          }

          .campus-art,
          .side-sign,
          .quote-right {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .student-page {
            background-image: url("/images/student_main-home_bg_mobile.png");
            background-size: cover;
            background-position: center top;
          }

          .brand-name {
            font-size: 28px;
          }

          .brand-tagline {
            font-size: 12px;
          }

          .profile-text,
          .notification {
            display: none;
          }

          .hero {
            margin-top: 35px;
          }

          .greeting {
            font-size: 16px;
          }

          .hero h1 {
            font-size: 31px;
          }

          .subtitle {
            font-size: 16px;
          }

          .cards {
            grid-template-columns: 1fr;
          }

          .discover {
            grid-column: auto;
          }

          .arena-card {
            min-height: 430px;
          }

          .learning-card {
            flex-wrap: wrap;
            gap: 10px;
          }

          .learning-text {
            margin-left: 0;
            max-width: calc(100% - 80px);
          }

          .learning-text p {
            font-size: 13px;
          }

          .courses-button {
            width: 100%;
            text-align: center;
            margin-left: 0;
          }

          .bottom-features {
            display: none;
          }

          .quote-left {
            position: relative;
            left: 0;
            margin-top: 25px;
          }
        }
      `}</style>
    </main>
  );
}