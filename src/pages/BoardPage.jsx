import { useCallback, useEffect, useRef, useState } from "react";
import GlobalHeader from "../components/GlobalHeader.jsx";
import PostItem from "../components/PostItem.jsx";
import { API_URL, PAGE_SIZE } from "../config.js";

const videos = ["tZooW6PritE", "oWSNOrBbOIU", "S7chAOXT0Y8", "mOk4ghoRtDo", "j4LlqGxOr2E"];

function BoardPage() {
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
      const response = await fetch(`${API_URL}/boards/posts?page=${page}&size=${PAGE_SIZE}`, {
        credentials: "include",
      });
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadPosts();
    }, { rootMargin: "200px" });
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

export default BoardPage;
