import BoardPage from "./pages/BoardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function App() {
  const path = window.location.pathname;

  if (path.endsWith("/board.html")) return <BoardPage />;
  if (path.endsWith("/post.html")) return <PostDetailPage />;
  if (path.endsWith("/signup.html")) return <SignupPage />;
  return <LoginPage />;
}

export default App;
