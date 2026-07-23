import { useCallback, useEffect, useState } from "react";
import GlobalHeader from "../components/GlobalHeader.jsx";
import { apiRequest, ApiError } from "../api/client.js";
import profileImage from "../../image/dog.jpg";

function PostDetailPage() {
  const postId = new URLSearchParams(window.location.search).get("id");
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(postId ? "" : "잘못된 접근입니다.");

  const loadPost = useCallback(async () => {
    if (!postId) return;
    const data = await apiRequest(`/boards/posts/${postId}`);
    setPost(data);
  }, [postId]);

  const loadComments = useCallback(async () => {
    if (!postId) return;
    const data = await apiRequest(`/boards/posts/${postId}/comment`);
    setComments(Array.isArray(data) ? data : []);
  }, [postId]);

  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      return;
    }
    Promise.all([loadPost(), loadComments()])
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false));
  }, [loadComments, loadPost, postId]);

  const toggleLike = async () => {
    try {
      await apiRequest(`/boards/likes/${postId}`, {
        method: post.isLiked ? "DELETE" : "POST",
      });
      setPost((current) => ({
        ...current,
        isLiked: !current.isLiked,
        likeCount: current.likeCount + (current.isLiked ? -1 : 1),
      }));
    } catch (likeError) {
      if (!(likeError instanceof ApiError && likeError.status === 401)) {
        window.alert(likeError.message || "좋아요 처리에 실패했습니다.");
      }
    }
  };

  const deletePost = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await apiRequest(`/boards/posts/${postId}`, {
        method: "DELETE",
      });
      window.location.href = "/board.html";
    } catch (deleteError) {
      if (!(deleteError instanceof ApiError && deleteError.status === 401)) {
        window.alert(deleteError.message || "게시글 삭제에 실패했습니다.");
      }
    }
  };

  const createComment = async (event) => {
    event.preventDefault();
    const content = commentContent.trim();
    if (!content) return;
    try {
      await apiRequest(`/boards/posts/${postId}/comment`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      setCommentContent("");
      await Promise.all([loadComments(), loadPost()]);
    } catch (commentError) {
      if (!(commentError instanceof ApiError && commentError.status === 401)) {
        window.alert(commentError.message || "댓글 등록에 실패했습니다.");
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await apiRequest(`/boards/posts/comment/${commentId}`, {
        method: "DELETE",
      });
      setComments((current) => current.filter((comment) => comment.commentId !== commentId));
      setPost((current) => ({ ...current, commentCount: Math.max(0, current.commentCount - 1) }));
    } catch (deleteError) {
      if (!(deleteError instanceof ApiError && deleteError.status === 401)) {
        window.alert(deleteError.message || "댓글 삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) return <><GlobalHeader /><p className="status-message page-status">게시글을 불러오는 중...</p></>;
  if (error || !post) {
    return <><GlobalHeader /><div className="page-status"><p className="status-message error">{error}</p><a href="/board.html">게시판으로 돌아가기</a></div></>;
  }

  return (
    <>
      <GlobalHeader />
      <article className="post-detail-container">
        <header className="post-detail-header">
          <h2 className="post-detail-title">{post.title}</h2>
          <div className="author-info">
            <img src={profileImage} alt="작성자 프로필" />
            <div className="author-meta">
              <span className="author-name">{post.writer}</span>
              <span className="post-timestamp">{post.createDate}</span>
            </div>
          </div>
          {post.owner && (
            <div className="post-actions">
              <button className="btn-edit" type="button" onClick={() => { window.location.href = `/edit.html?id=${postId}`; }}>수정</button>
              <button className="btn-delete" type="button" onClick={deletePost}>삭제</button>
            </div>
          )}
        </header>
        <main className="post-detail-content">
          <p>{post.content}</p>
          <img src={profileImage} alt="게시글 이미지" />
        </main>
        <footer className="post-detail-footer">
          <div className="post-stats">
            <button className={`btn-like${post.isLiked ? " active" : ""}`} type="button" onClick={toggleLike}>
              <span aria-hidden="true">{post.isLiked ? "♥" : "♡"}</span> {post.likeCount}
            </button>
            <span>💬 {post.commentCount}</span>
            <span>조회수 {post.viewCount}</span>
          </div>
        </footer>
        <section className="comments-container">
          <h3>댓글</h3>
          <form className="comment-form" onSubmit={createComment}>
            <textarea
              placeholder="댓글을 입력하세요..."
              required
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
            />
            <button type="submit" className="btn-comment-submit">등록</button>
          </form>
          <div className="comment-list">
            {comments.map((comment) => (
              <div className="comment-item" key={comment.commentId}>
                <div className="comment-author">
                  <img src={profileImage} alt="프로필" />
                  <span>{comment.writer}</span>
                </div>
                <div className="comment-content">
                  <p>{comment.content}</p>
                  <span className="comment-timestamp">{comment.createDate}</span>
                </div>
                <div className="comment-actions">
                  <button className="btn-delete-comment" type="button" onClick={() => deleteComment(comment.commentId)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}

export default PostDetailPage;
