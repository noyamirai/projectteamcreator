const generate = async (students, teamSize) => {
    // console.log(`${students.length} students need to be put in teams`);

    let allTeams = [];
    let teamObject;

    let studentsInTeam = [];

    let teamCounter = 0;
    let studentCounter = 0;

    const amountOfTeams = Math.floor(students.length / teamSize); // round down
    const remainders = students.length % teamSize;

    // creating teamobjects into allTeams[]
    for (let i = 0; i < amountOfTeams; i++) {
        teamCounter++;
        teamObject = { name: `team-${teamCounter}` };
        allTeams.push(teamObject);
    }

    // loop through teams
    for (let i = 0; i < amountOfTeams; i++) {
        let studentsWithoutTeam = [];

        // get x random students
        for (let i = 0; i < teamSize; i++) {
            
            // if students have been added to teams
            if (studentsWithoutTeam > 0) {
                getRandomStudent(studentsWithoutTeam, studentsInTeam).then(addToTeam);            
            } else {
                console.log('students have not been added to teams yet');
                getRandomStudent(students, studentsInTeam).then(addToTeam);    
            }
        }

        function addToTeam(data) {
            student = data[0];
            studentsWithoutTeam = data[1]; 

            console.log(`adding student to in_team array: ${student}`);
            studentsInTeam.push({ name: student.user.name.first, cmd_skill: student.cmd_skills.best });

            // add students to team
            allTeams[i].students = studentsInTeam;

            // reset for next team
            studentsInTeam = [];
        }   
    }

    // //  what to do with remainding students
    // if (remainders == 1) {
    //     students.forEach((student) => {
    //         allTeams[amountOfTeams-1].students.push(student.user.name.first);
    //     });
    // } else if (remainders > 1) {
    //     let newStudentsInTeam = [];
    //     students.forEach((student) => {
    //         newStudentsInTeam.push(student.user.name.first);
    //     });

    //     allTeams.push({ name: `team-${teamCounter}`, students: newStudentsInTeam });
    // }
}

const getRandomStudent = async (students, studentsInTeam) => {
    const randomIndex = Math.floor(Math.random() * (students.length - 1));
    const student = students[randomIndex];

    // student inside team
    if (Array.isArray(studentsInTeam) && studentsInTeam.length) {

        // check if cmd skill is already in array
        if (studentsInTeam.some(e => e.cmd_skill === student.cmd_skills.best)) {
            console.log(`cmd skill already in team: ${student.cmd_skills.best}`);
            console.log(`GET NEW STUDENT!!!`);

            // recursion
            getRandomStudent(students, studentsInTeam);

        } else {
            console.log(`cmd skill not in team yet: ${student.cmd_skills.best}`);
            
            // remove student so every pick remains random
            const studentsWithoutTeam = students.filter(item => item.id == student.id);
            
            // return student so they can be added to array
            return await [student, studentsWithoutTeam];
        }
    } else {
        console.log(`no one in team yet`);

        const studentsWithoutTeam = students.filter(item => item.id == student.id);
        
        // no one in team yet, so just return random student object
        return await [student, studentsWithoutTeam];
    }    
}

module.exports = {
    generate
};