const imageInput = document.getElementById("profImage");
const userNameInput = document.getElementById("userNameTaker");

const actionFun = () => {
  localStorage.setItem("uname", userNameInput.value);
  localStorage.setItem("picURL", imageInput.value);
}