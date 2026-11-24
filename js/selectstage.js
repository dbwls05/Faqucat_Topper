// resetProgress();

for (let i = 1; i <= 6; i++) {
    clearStage(i);
}
// 스테이지 잠금 해제 상태를 확인하고 UI를 업데이트하는 함수
function updateStageUI() {
    for (let i = 1; i <= 6; i++) {
        const img = document.getElementById(`stage${i}`);
        const isClear = i === 1 || (i > 1 && localStorage.getItem(`stage${i-1}_clear`) === "true");

        if (isClear) {
            // 스테이지 잠금 해제됨
            img.src = `img/stageSelect${i}.png`;
            img.classList.remove('locked');
            img.style.cursor = 'pointer';
        } else {
            // 스테이지 잠김
            img.src = `img/stageSelect0.png`;
            img.classList.add('locked');
            img.style.cursor = 'not-allowed';
        }
    }
}

// 스테이지 클릭 이벤트 처리
function handleStageClick(stageNum) {
    const isUnlocked = stageNum === 1 || (stageNum > 1 && localStorage.getItem(`stage${stageNum-1}_clear`) === "true");

    if (isUnlocked) {
        location.href = `stage${stageNum}.html`;
    } else {
        console.log(`Stage ${stageNum} is locked!`);
    }
}

// 페이지 로드 시 초기화
window.onload = () => {
    updateStageUI();

    // 모든 스테이지 이미지에 클릭 이벤트 추가
    for (let i = 1; i <= 6; i++) {
        const img = document.getElementById(`stage${i}`);
        img.addEventListener('click', () => handleStageClick(i));
    }
};

// 테스트용: 콘솔에서 스테이지 클리어 상태를 설정할 수 있습니다
// 예: clearStage(1) - 1번 스테이지 클리어
function clearStage(stageNum) {
    localStorage.setItem(`stage${stageNum}_clear`, "true");
    updateStageUI();
    console.log(`Stage ${stageNum} cleared!`);
}

// 테스트용: 모든 진행상황 초기화
function resetProgress() {
    for (let i = 1; i <= 6; i++) {
        localStorage.removeItem(`stage${i}_clear`);
    }
    updateStageUI();
    console.log('All progress reset!');
}
