"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentHome() {
  const [user, setUser] = useState<{
    fullName: string;
    userId: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    loadUser();
  }, []);

  const hour = new Date().getHours();

  const timeOfDay = hour < 12? "morning" : hour < 17? "afternoon" : "evening";

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
            <strong>{user?.fullName || "Student"}</strong>
            <small>Student&nbsp; • &nbsp;IT Sem 5</small>
          </div>

          <div className="chevron">⌄</div>
        </div>
      </header>

      {/* MAIN */}
      <section className="hero">
        <p className="greeting">
          Good {timeOfDay}, {user?.fullName || "Student"}! 👋
        </p>

        <h1>What do you want to do today?</h1>

        <p className="subtitle">
          Choose a path and make progress.
        </p>

        {/* SAME CAMPUS */}
        <div className="quote quote-right">
          Same Campus
          <br />
          Bigger Possibilities
          <div className="yellow-line" />
        </div>
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

          padding: 16px 5% 45px;
        }

        .sky-glow {
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        .sky-left {
          left: -225px;
          top: 135px;
          background: rgba(88, 180, 255, 0.12);
        }

        .sky-right {
          right: -225px;
          top: 190px;
          background: rgba(88, 180, 255, 0.12);
        }

        /* HEADER */

        .top-header {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1030px;
          margin: 0 auto;
        }

        .brand-name {
          font-size: 29px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -1.5px;
          color: #10152f;
        }

        .brand-name span {
          color: #1164db;
        }

        .brand-tagline {
          margin-top: 6px;
          color: #596887;
          font-size: 12px;
        }

        .profile-area {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-left: auto;
          transform: translateX(28px);
        }

        .notification {
          position: relative;
          font-size: 24px;
          transform: rotate(180deg);
          margin-right: 10px;
        }

        .notification span {
          position: absolute;
          top: -4px;
          right: -7px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ef2d36;
          color: white;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(180deg);
          font-weight: 700;
        }

        .avatar {
          width: 39px;
          height: 39px;
          border-radius: 50%;
          background: linear-gradient(145deg, #222d43, #111827);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 10px;
          border: 2px solid white;
          box-shadow: 0 2px 9px rgba(0, 0, 0, 0.12);
        }

        .profile-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .profile-text strong {
          font-size: 12px;
        }

        .profile-text small {
          font-size: 11px;
          color: #687695;
        }

        .chevron {
          font-size: 23px;
          margin-left: 14px;
          transform: translateY(-3px);
        }

        /* HERO */

        .hero {
          position: relative;
          z-index: 5;
          text-align: center;
          margin: 20px auto 14px;
        }

        .greeting {
          margin: 0 0 7px;
          color: #344267;
          font-size: 16px;
        }

        .hero h1 {
          margin: 0;
          font-size: 36px;
          line-height: 1.15;
          letter-spacing: -1.4px;
          font-weight: 800;
        }

        .subtitle {
          margin: 6px 0 0;
          font-size: 15px;
          color: #5a6788;
        }

        /* SAME CAMPUS */

        .quote-right {
          position: absolute;
          right: 1%;
          top: 13px;
          text-align: center;
          font-family: "Comic Sans MS", "Segoe Print", cursive;
          font-size: 16px;
          line-height: 1.25;
          color: #25345e;
          transform: rotate(-5deg);
        }

        .yellow-line {
          width: 65px;
          height: 3px;
          background: #f4b900;
          margin: 6px auto 0;
          transform: rotate(-4deg);
        }

        /* CARDS */

        .cards {
          position: relative;
          z-index: 6;
          max-width: 1050px;
          margin: 14px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .arena-card {
          min-height: 365px;
          padding: 20px 23px 18px;
          border-radius: 16px;
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
          width: 64px;
          height: 64px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 29px;
          margin-bottom: 8px;
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
          font-size: 24px;
          line-height: 1.1;
          letter-spacing: -0.8px;
        }

        .card-description {
          margin: 4px 0 0;
          font-size: 14px;
          line-height: 1.4;
          color: #48587d;
        }

        .divider {
          height: 1px;
          background: rgba(47, 66, 98, 0.14);
          margin: 13px 0 9px;
        }

        .arena-card ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .arena-card li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #243253;
        }

        .arena-card li span {
          width: 21px;
          text-align: center;
          font-size: 15px;
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
          bottom: 17px;
          left: 22px;
          right: 22px;
          height: 43px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          font-weight: 700;
          font-size: 14px;
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
          font-size: 22px;
          font-weight: 400;
        }

        /* LEARNING */

        .learning-card {
          position: relative;
          z-index: 7;
          max-width: 870px;
          min-height: 70px;
          margin: 18px auto 0;
          padding: 10px 18px;
          border: 1px solid #dce7f4;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 5px 20px rgba(40, 75, 120, 0.05);
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #101735;
        }

        .book-icon {
          width: 52px;
          height: 45px;
          border-radius: 13px;
          background: #eaf3ff;
          border: 1px solid #cbdff7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #17355e;
          font-size: 22px;
        }

        .learning-text {
          margin-left: 15px;
        }

        .learning-text h3 {
          margin: 0;
          font-size: 17px;
        }

        .learning-text p {
          margin: 3px 0 0;
          font-size: 13px;
          color: #566584;
        }

        .courses-button {
          margin-left: auto;
          padding: 10px 17px;
          border: 1px solid #d1e1f6;
          border-radius: 25px;
          background: #f4f8fd;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .courses-button b {
          font-size: 20px;
          margin-left: 11px;
          font-weight: 400;
        }

        /* BOTTOM */

        .bottom-area {
          position: relative;
          z-index: 8;
          max-width: 1050px;
          margin: 32px auto 0;
          min-height: 75px;
        }

        .quote {
          position: absolute;
          font-family: "Comic Sans MS", "Segoe Print", cursive;
          font-size: 15px;
          line-height: 1.4;
          color: #25345e;
        }

        .quote-left {
          left: 0;
          bottom: 0;
          transform: rotate(-3deg);
        }

        .underline {
          width: 65px;
          height: 3px;
          background: #f4b900;
          margin-top: 6px;
          transform: rotate(-7deg);
        }

        .bottom-features {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          color: #506083;
          font-size: 12px;
          padding-top: 28px;
        }

        .bottom-features div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bottom-features span {
          color: #101735;
          font-size: 22px;
          font-weight: 700;
        }

        .bottom-features i {
          width: 1px;
          height: 28px;
          background: #aebbd0;
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

          .profile-area {
            transform: none;
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