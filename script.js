function showPage(page) {
  document.querySelectorAll('.course-detail').forEach(section => {
    section.classList.remove('active');
  });

  const mainSections = ['main-banner', 'main-courses', 'main-notice'];
  mainSections.forEach(id => {
    const el = document.getElementById(id);
    el.style.display = (page === 'main') ? 'block' : 'none';
  });

  if (page !== 'main') {
    const target = document.getElementById(
      page === 'login' ? 'login-section' : 'course-' + page
    );
    if (target) target.classList.add('active');
  }
}

window.addEventListener('hashchange', () => {
  const page = location.hash.replace('#', '') || 'main';
  showPage(page);
});

document.addEventListener("DOMContentLoaded", () => {
  const page = location.hash.replace('#', '') || 'main';
  showPage(page);

  // 로그인 기능 처리
  const loginForm = document.getElementById("login-form");
  const userMenu = document.querySelector(".user-menu");
  const loginSection = document.getElementById("login-section");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // 로그인 성공 UI 반영
      userMenu.innerHTML = `<span style="color:white;">환영합니다.</span>`;
      loginSection.classList.remove("active");

      // 메인으로 이동
      location.hash = "#main";
    });
  }

  // --- 소셜 아이콘 크기 고정 기능 ---
  function setFixedIconSize() {
    const zoom = window.devicePixelRatio || 1; // 현재 브라우저 배율
    document.querySelectorAll('.social-icons img').forEach(icon => {
      icon.style.transform = `scale(${1 / zoom})`; // 반비례 스케일 적용
      icon.style.transformOrigin = 'bottom right'; // 고정 위치 기준
    });
  }

  // 페이지 로드 & 브라우저 크기 변경 시 실행
  setFixedIconSize();
  window.addEventListener('resize', setFixedIconSize);
});
  // 페이지 로드 시 서버에 방문 기록 전송
  fetch('/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: window.location.pathname })
  });
