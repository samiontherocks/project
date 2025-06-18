(function checkLogin() {
  const isLogin = localStorage.getItem("isLogin");

  if (isLogin !== "true") {
    alert("로그인이 필요한 서비스입니다.");
    window.location.href = "../login/login.html";
  }
})();
