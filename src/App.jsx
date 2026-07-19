import BoardPage from "./pages/BoardPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";

function App() {
  const isPostPage = window.location.pathname.endsWith("/post.html");

  return isPostPage ? <PostDetailPage /> : <BoardPage />;
}

export default App;
