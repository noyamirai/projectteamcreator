console.log('TEAM DETAILS SCRIPT ACTIVE');

const teamListEl = document.querySelectorAll(".grid--list__team-members");
const teamHeadingEl = document.querySelectorAll(".teamHeading");

const nextItemBtn = document.querySelector("#next-item");
const skipBtn = document.querySelector("#skip-all");

let counter = 0;
const amountOfTeams = teamListEl.length;
console.log(amountOfTeams);
teamListEl[0].classList.toggle("hide");
teamHeadingEl[0].classList.toggle("hide");

// BRON: https://stackoverflow.com/a/16750711
const RemoveLastDirectoryPartOf = (url) => {
    let array = url.split('/');
    array.pop();
    return (array.join('/'));
}

nextItemBtn.addEventListener('click', event => {
    console.log(counter);

    // last click
    if ((counter + 1) === amountOfTeams) {
        nextItemBtn.href = RemoveLastDirectoryPartOf(window.location.pathname);
    } else {
        teamListEl.forEach(el => {
            if (!el.classList.contains("hide")) {
                el.classList.add("hide");
            }
        });

        teamHeadingEl.forEach(el => {
            if (!el.classList.contains("hide")) {
                el.classList.add("hide");
            }
        });

        counter++;

        teamListEl[counter].classList.toggle("hide");
        teamHeadingEl[counter].classList.toggle("hide");
    }
})

skipBtn.href = RemoveLastDirectoryPartOf(window.location.pathname);