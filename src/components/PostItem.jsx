import profileImage from "../../image/dog.jpg";

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

export default PostItem;
