import { useCallback, useEffect, useRef, useState } from "react";
import profileImage from "../image/dog.jpg";

const API_URL = "http://localhost:8080";
const PAGE_SIZE = 10;

const videos = [
  "tZooW6PritE",
  "oWSNOrBbOIU",
  "S7chAOXT0Y8",
  "mOk4ghoRtDo",
  "j4LlqGxOr2E",
];

function GlobalHeader({ isDark, onToggleDark }) {
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
      <div className="darkmode">
        <button className="darkmode_btn" type="button" onClick={onToggleDark}>
          {isDark ? "☀️ 일반 모드로 보기" : "🌗 다크 모드로 보기"}
        </button>
      </div>
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

function PostItem({ post }) {
  const openPost = () => {
    window.location.href = `/post.html?id=${post.boardId}`;
  };

  return (
    <article
      className="post-item"
      onClick={openPost}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") openPost();
      }}
      role="link"
      tabIndex={0}
    >
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span>♡ {post.likeCount}</span>
          <span>💬 {post.commentCount}</span>
          <span>조회수 {post.viewCount}</span>
        </div>
        <div className="post-date">{post.createDate}</div>
      </div>
      <div className="post-author">
        <img src={profileImage} alt="작성자 프로필" />
        <span>{post.writer}</span>
      </div>
    </article>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);

  const loadPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/boards/posts?page=${page}&size=${PAGE_SIZE}`,
        { credentials: "include" },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "게시글을 불러오지 못했습니다.");
      }

      const data = await response.json();
      const nextPosts = Array.isArray(data.content) ? data.content : [];
      setPosts((current) => [...current, ...nextPosts]);
      setHasMore(data.last === false || (data.last == null && nextPosts.length === PAGE_SIZE));
      setPage((current) => current + 1);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    return () => document.body.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadPosts();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadPosts]);

  return (
    <>
      <GlobalHeader isDark={isDark} onToggleDark={() => setIsDark((dark) => !dark)} />
      <div className="board-layout">
        <section className="board-container">
          <header className="board-header">
            <h1>자유 게시판</h1>
            <button className="btn-write" type="button" onClick={() => { window.location.href = "/write.html"; }}>
              글쓰기
            </button>
          </header>

          <main className="post-list">
            {posts.map((post) => <PostItem key={post.boardId} post={post} />)}
            {error && <p className="status-message error">{error}</p>}
            {error && <button className="retry-button" type="button" onClick={loadPosts}>다시 시도</button>}
            {isLoading && <p className="status-message">게시글을 불러오는 중...</p>}
            {!isLoading && !error && posts.length === 0 && <p className="status-message">게시글이 없습니다.</p>}
            <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
          </main>
        </section>

        <aside className="right-sidebar">
          {videos.map((videoId) => (
            <iframe
              key={videoId}
              width="300"
              height="160"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={`추천 영상 ${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ))}
        </aside>
      </div>
    </>
  );
}

export default App;
