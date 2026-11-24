// 화면 크기에 맞춰 페이지 전체를 비율 유지한 채 축소/확대한다. (스크롤 없음)
(function () {
    const DESIGN_WIDTH = 1920; // 기준 레이아웃 너비(px)
    const PADDING = 20;        // 가장자리 여백(px)

    function fit() {
        const c = document.querySelector('.container');
        if (!c) return;

        // 기준 크기로 레이아웃을 고정하고, 실제 높이를 측정한다.
        c.style.position = 'absolute';
        c.style.transformOrigin = '0 0';
        c.style.transform = 'none';
        c.style.boxSizing = 'border-box';
        c.style.margin = '0';
        c.style.padding = PADDING + 'px';
        c.style.width = DESIGN_WIDTH + 'px';
        const h = c.offsetHeight;

        const s = Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / h);
        c.style.left = (window.innerWidth - DESIGN_WIDTH * s) / 2 + 'px';
        c.style.top = (window.innerHeight - h * s) / 2 + 'px';
        c.style.transform = 'scale(' + s + ')';
    }

    window.addEventListener('resize', fit);
    window.addEventListener('load', fit); // 이미지 로딩 후 높이가 바뀔 수 있음
    fit();
})();
