import { useEffect, useState } from "react";
import { apiRequest, ApiError } from "../api/client.js";
import GlobalHeader from "../components/GlobalHeader.jsx";

function EditPage() {
  const postId = new URLSearchParams(window.location.search).get("id");
  const [form, setForm] = useState({ title: "", content: "" });
  const [imageInfo, setImageInfo] = useState("");
  const [error, setError] = useState(postId ? "" : "잘못된 접근입니다.");
  const [isLoading, setIsLoading] = useState(Boolean(postId));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) return;

    apiRequest(`/boards/posts/${postId}`)
      .then((post) => {
        setForm({ title: post.title || "", content: post.content || "" });
        if (post.imageUrl) setImageInfo(`현재 이미지: ${post.imageUrl.split("/").pop()}`);
      })
      .catch((loadError) => {
        if (!(loadError instanceof ApiError && loadError.status === 401)) {
          setError(loadError.message || "게시글을 불러오지 못했습니다.");
        }
      })
      .finally(() => setIsLoading(false));
  }, [postId]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiRequest(`/boards/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      window.alert("게시글이 수정되었습니다.");
      window.location.href = `/post.html?id=${postId}`;
    } catch (submitError) {
      if (!(submitError instanceof ApiError && submitError.status === 401)) {
        setError(submitError.message || "수정에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <GlobalHeader />
      <main className="page-shell">
        <section className="write-container">
          <header className="write-header">
            <button className="btn-back" type="button" onClick={() => window.history.back()}>
              뒤로가기
            </button>
            <h2>게시글 수정</h2>
            <div className="write-header-spacer" />
          </header>

          {isLoading && <p className="status-message">게시글을 불러오는 중...</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          {!isLoading && !error && (
            <form onSubmit={submitEdit}>
              <div className="input-group">
                <label htmlFor="title">제목</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="제목을 입력하세요"
                  value={form.title}
                  onChange={updateField}
                />
              </div>
              <div className="input-group">
                <label htmlFor="content">내용</label>
                <textarea
                  id="content"
                  name="content"
                  rows="10"
                  required
                  placeholder="내용을 입력하세요"
                  value={form.content}
                  onChange={updateField}
                />
              </div>
              <div className="input-group">
                <label htmlFor="post-image">이미지 수정 (선택)</label>
                <input id="post-image" type="file" accept="image/*" />
                {imageInfo && <div className="current-image-info">{imageInfo}</div>}
              </div>
              <div className="button-group">
                <button type="submit" className="btn-login" disabled={isSubmitting}>
                  {isSubmitting ? "수정 중..." : "수정하기"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </>
  );
}

export default EditPage;
