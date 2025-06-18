// include.js
window.addEventListener('DOMContentLoaded', () => {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(async (el) => {
    const file = el.getAttribute('data-include');
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error();
      const html = await res.text();
      el.innerHTML = html;

      setTimeout(() => {
        setActiveMenu();
        setProfileLink();
      }, 0);

    } catch {
      el.innerHTML = `<p style="color:red;">${file} 불러오기 실패</p>`;
    }
  });
});

function setActiveMenu() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');

  document.querySelectorAll('.gnb a').forEach((link) => {
    const target = link.dataset.page;
    if (target === page) {
      link.classList.add('active');
    }
  });
}

function setProfileLink() {
  const isLogin = localStorage.getItem('isLogin') === 'true';
  const profileLink = document.querySelector('.profile-icon a');

  if (profileLink) {
    profileLink.setAttribute('href', isLogin ? '../user/user.html' : '../login/login.html');
  }
}
