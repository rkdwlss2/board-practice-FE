import { useEffect, useState } from "react";
import { apiRequest, ApiError, clearClientAuthState } from "../api/client.js";
import AuthField from "../components/AuthField.jsx";

function ProfileEditPage() {
  const [form, setForm] = useState({ email: "", nickname: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiRequest("/users/me")
      .then((user) => setForm({ email: user.email || "", nickname: user.nickname || "" }))
      .catch((loadError) => {
        if (!(loadError instanceof ApiError && loadError.status === 401)) {
          setError(loadError.message || "회원정보를 불러오지 못했습니다.");
        }
      });
  }, []);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({ nickname: form.nickname }),
      });
      window.alert("닉네임 수정되었습니다.");
      window.location.href = "/board.html";
    } catch (submitError) {
      if (!(submitError instanceof ApiError && submitError.status === 401)) {
        setError(submitError.message || "수정에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const withdraw = async () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까? 데이터가 모두 삭제됩니다.")) return;

    try {
      await apiRequest("/users/me", {
        method: "DELETE",
        body: JSON.stringify({ email: form.email }),
      });
      clearClientAuthState();
      window.alert("회원 삭제되었습니다.");
      window.location.href = "/index.html";
    } catch (withdrawError) {
      if (!(withdrawError instanceof ApiError && withdrawError.status === 401)) {
        setError(withdrawError.message || "삭제에 실패했습니다.");
      }
    }
  };

  return (
    <main className="page-shell">
      <section className="signup-container">
        <h2>회원정보 수정</h2>
        <form onSubmit={submitProfile}>
          <AuthField
            label="이메일"
            id="email"
            type="email"
            readOnly
            value={form.email}
            onChange={updateField}
            className="readonly-input"
          />
          <AuthField
            label="닉네임"
            id="nickname"
            type="text"
            required
            placeholder="새 닉네임을 입력하세요"
            value={form.nickname}
            onChange={updateField}
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="button-group">
            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? "수정 중..." : "수정완료"}
            </button>
            <button type="button" className="btn-withdraw" onClick={withdraw}>
              회원탈퇴
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ProfileEditPage;
