// board.js
document.addEventListener("DOMContentLoaded", () => {
  const writePostBtn = document.getElementById("write-post-btn");
  if (writePostBtn) {
    writePostBtn.addEventListener("click", () => {
      window.location.href = "write.html";
    });
  }

  // 게시글 목록 컨테이너에 이벤트 리스너 추가 (이벤트 위임)
  const postListContainer = document.getElementById("post-list-container");
  if (postListContainer) {
    postListContainer.addEventListener("click", (e) => {
      // 클릭된 요소가 post-item 또는 그 자식인지 확인
      const postItem = e.target.closest(".post-item");
      if (postItem) {
        const postId = postItem.dataset.postId; // HTML에 data-post-id 속성 추가 필요
        if (postId) {
          window.location.href = `post.html?id=${postId}`;
        }
      }
    });
  }

  $(".darkmode_btn").on("click", function () {
    const isDark = $("body").toggleClass("dark").hasClass("dark");

    $(".board-container").toggleClass("dark", isDark);
    $(".global-header").toggleClass("dark", isDark);
    $(".post-item").toggleClass("dark", isDark);

    $(".darkmode_span").text(
        isDark ? "☀️ 일반 모드로 보기" : "🌗 다크 모드로 보기"
    );
  });

  // 초기 게시글 10개 목록 조회 API 연동
  let page = 0;
  const size = 10;
  storyLoad();
  function storyLoad() {
    fetch(`http://localhost:8080/boards/posts?page=${page}&size=${size}`, {
      method: "GET",
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message) {
            alert(errorData.message);
          }
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          const postList = document.querySelector("#post-list-container");
          const posts = data.content;
          postList.innerHTML += posts
            .map(
              (post) => `
                <article class="post-item" data-post-id="${post.boardId}">
                    <div class="post-content">
                        <h3 class="post-title">${post.title}</h3>
                        <div class="post-meta">
                            <span><i class="fa-regular fa-heart"></i> ${post.likeCount}</span>
                            <span><i class="fa-regular fa-comment"></i> ${post.commentCount}</span>
                            <span>조회수 ${post.viewCount}</span>
                        </div>
                        <div class="post-date">${post.createDate}</div>
                    </div>
                    <div class="post-author">
                        <img src="./image/dog.jpg" alt="작성자 프로필 이미지">
                        <span>${post.writer}</span>
                    </div>
                </article>
                `
            )
            .join("");
          console.log("게시글 목록 조회 성공:", data);
        }
      })
      .catch((error) => {
        console.error("네트워크 Error:", error);
      });
  }

  // (2) 스토리 스크롤 페이징하기
  window.addEventListener("scroll", function () {
    // console.log("윈도우 scrollTop",window.scrollY);
    // console.log("문서의 높이",document.documentElement.scrollHeight);
    // console.log("윈도우 높이",window.innerHeight);

    let checkNum =
      window.scrollY -
      (document.documentElement.scrollHeight - window.innerHeight);
    // console.log(checkNum);

    if (checkNum < 1 && checkNum > -1) {
      page++;
      storyLoad();
    }
  });
});
