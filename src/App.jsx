import BoardPage from "./pages/BoardPage.jsx";
import EditPage from "./pages/EditPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PasswordEditPage from "./pages/PasswordEditPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import WritePage from "./pages/WritePage.jsx";

function App() {
  const path = window.location.pathname;

  if (path.endsWith("/board.html")) return <BoardPage />;
  if (path.endsWith("/post.html")) return <PostDetailPage />;
  if (path.endsWith("/signup.html")) return <SignupPage />;
  if (path.endsWith("/write.html")) return <WritePage />;
  if (path.endsWith("/edit.html")) return <EditPage />;
  if (path.endsWith("/profile_edit.html")) return <ProfileEditPage />;
  if (path.endsWith("/password_edit.html")) return <PasswordEditPage />;
  return <LoginPage />;
}

export default App;
