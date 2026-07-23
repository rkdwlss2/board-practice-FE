import { useState } from "react";
import { apiRequest } from "../api/client.js";
import AuthField from "../components/AuthField.jsx";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const login = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify(form),
        redirectOnUnauthorized: false,
      });
      window.location.href = "/board.html";
    } catch (loginError) {
      const details = loginError.details || {};
      if (details.email) setError("올바른 이메일 주소 형식을 입력해 주세요.");
      else if (details.password) setError("비밀번호는 8~20자이며 대·소문자, 숫자, 특수문자를 포함해야 합니다.");
      else setError(loginError.message || "로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="animated-bg" />
      <section className="auth-card login-container">
        <div className="auth-heading">
          <span className="auth-eyebrow">COMMUNITY</span>
          <h1>다시 만나서 반가워요</h1>
          <p>게시판에 로그인하고 이야기를 이어가세요.</p>
        </div>
        <form onSubmit={login}>
          <AuthField label="이메일" id="email" type="email" required autoComplete="email" placeholder="이메일을 입력하세요" value={form.email} onChange={updateField} />
          <AuthField label="비밀번호" id="password" type="password" required autoComplete="current-password" placeholder="비밀번호를 입력하세요" value={form.password} onChange={updateField} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="button-group">
            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
            <a className="auth-secondary-link" href="/signup.html">처음이신가요? 회원가입</a>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
