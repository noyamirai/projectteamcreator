const formTriggerBtn = document.querySelector(`.form-trigger`);
const bodyEl = document.querySelector(`body`);
const formEl = document.querySelector(`form`);
const closeFormBtn = document.querySelector(`#close-form`);

// no href basically
formTriggerBtn.href = `javascript:void(0)`;

const toggleClass = () => {
    bodyEl.classList.toggle(`overlay`);
    formEl.classList.toggle(`form-active`);
};

formTriggerBtn.addEventListener(`click`, () => {
    toggleClass();
});

closeFormBtn.addEventListener(`click`, event => {
    event.preventDefault();

    toggleClass();
});