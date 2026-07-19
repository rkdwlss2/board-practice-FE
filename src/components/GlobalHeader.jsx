import { useEffect, useRef, useState } from "react";
import profileImage from "../../image/dog.jpg";

function GlobalHeader({ isDark = false, onToggleDark }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <header className="global-header">
      {onToggleDark && (
        <div className="darkmode">
          <button className="darkmode_btn" type="button" onClick={onToggleDark}>
            {isDark ? "☀️ 일반 모드로 보기" : "🌗 다크 모드로 보기"}
          </button>
        </div>
      )}
      <div
        className="user-menu"
        ref={menuRef}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <audio
          src="https://p.scdn.co/mp3-preview/0ba9d38f5d1ad30f0e31fc8ee80c1bebf0345a0c"
          controls
          onClick={(event) => event.stopPropagation()}
        />
        <img src={profileImage} alt="내 프로필" />
        <div className={`dropdown-menu${isMenuOpen ? " show" : ""}`}>
          <a href="/profile_edit.html">회원정보수정</a>
          <a href="/password_edit.html">비밀번호수정</a>
          <a href="/index.html">로그아웃</a>
        </div>
      </div>
    </header>
  );
}

export default GlobalHeader;
