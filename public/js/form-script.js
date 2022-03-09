const formTriggerBtn = document.querySelector(".form-trigger");
const bodyEl = document.querySelector("body");
const formEl = document.querySelector("form");
const closeFormBtn = document.querySelector("#close-form");

formTriggerBtn.addEventListener("click", event => {
    bodyEl.classList.toggle("overlay");
    formEl.classList.toggle("form-active");
});

closeFormBtn.addEventListener("click", event => {
    event.preventDefault();
    
    bodyEl.classList.toggle("overlay");
    formEl.classList.toggle("form-active");
});