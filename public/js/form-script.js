const formTriggerBtn = document.querySelector(`.form-trigger`);
const bodyEl = document.querySelector(`body`);
const formEl = document.querySelector(`form`);
const closeFormBtn = document.querySelector(`#close-form`);

const toggleClass = () => {
    bodyEl.classList.toggle(`overlay`);
    formEl.classList.toggle(`form-active`);
}

formTriggerBtn.addEventListener(`click`, event => {
    toggleClass();
});

closeFormBtn.addEventListener(`click`, event => {
    event.preventDefault();

    toggleClass();
});