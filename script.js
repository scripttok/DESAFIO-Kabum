const formValid = document.getElementById("form-valid");

if (formValid) {
  formValid.addEventListener("submit", async (e) => {
    const campoName = document.querySelector(".name-input").value;
    const campoPassword = document.querySelector(".password-input").value;

    if (campoName === "" || campoPassword === "") {
      console.log("Precisa preencher os 2 campos");
      e.preventDefault();
      document.getElementById("empty").innerHTML =
        "<p style='color: #f00;'>Por favor preencha o campo Nome</p>";
      return;
    }
    console.log("campos preenchidos");
    window.location.href = "/user";
  });
}
