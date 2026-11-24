const pauseBtn = document.getElementById("pauseBtn");
const popupBackground = document.getElementById("popupBackground");
const retryBtn = document.getElementById("retryBtn");
const exitBtn = document.getElementById("exitBtn");

// 일시정지 클릭 시 팝업 보이기
pauseBtn.addEventListener("click", () => {
    popupBackground.style.display = "flex";
});

// Retry 클릭 시 새로고침
retryBtn.addEventListener("click", () => {
    location.reload();
});

// Exit 클릭 시 index.html 이동
exitBtn.addEventListener("click", () => {
    location.href = "index.html";
});
