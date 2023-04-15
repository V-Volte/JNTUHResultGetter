document.getElementById("htno").addEventListener("keypress", (e) => {
    if (e.code == 'Enter') {
        getResult();
    }
});



function toTitleCase(text, isName) {
    if (isName == true) {
        return text.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    var i, j, str, lowers, uppers;
    str = text.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'
    ];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function (txt) {
                return txt.toLowerCase();
            });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
            uppers[i].toUpperCase());

    return str;
}

let changed = 0;

function pushObjectsToTop() {
    let topbar = document.getElementById('topcont');
    topbar.classList.remove('cover');
    topbar.classList.add('topbar');
    document.getElementById('htno').classList.remove('inputoriginal');
    document.getElementById('submit').classList.remove('buttonoriginal');
    document.getElementById('grouper').classList.remove('grouperoriginal');
    document.getElementById('all').classList.remove('buttonoriginal');
    changed = 1;
}

function deleteElements(elementList = []) {
    // remove all children of the element with id container
    let container = document.getElementById("container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function getResult() {
    let htno = document.getElementById("htno").value;
    if (!htno) {
        alert("Enter hallticket number")
        return;
    }

    if (changed == 0) pushObjectsToTop();

    let xhr = new XMLHttpRequest();
    xhr.open('POST', "/", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {

        if (this.status == 200 || this.status == 304) {

            deleteElements(["table", "name", "htnoout", "subjectcontainer", "infodiv"]);

            let data = JSON.parse(this.responseText);
            let sdata = data["subjects"];
            let name = toTitleCase(data.name, true);

            let infoDiv = document.createElement("div");
            infoDiv.id = 'infodiv';
            infoDiv.classList.add('infodiv');

            let nh = document.createElement('h1');
            nh.id = "name";
            nh.innerHTML = `${name}`;
            infoDiv.appendChild(nh);


            let subjectContainer = document.createElement("div");
            subjectContainer.classList.add('subjectcontainer');
            subjectContainer.id = 'subjectcontainer';

            let cgpa = createSubjects(sdata, subjectContainer, true);

            if (document.getElementById('container').contains(document.getElementById('CGPA'))) {
                document.getElementById('container').removeChild(document.getElementById('CGPA'));
            }
            let CGPA = document.createElement("h1");
            CGPA.id = 'CGPA';
            CGPA.innerHTML = `${cgpa == 0 ? 'No' : cgpa.toFixed(2)} <span class = "sgpa"> SGPA </span>`;

            infoDiv.appendChild(CGPA);
            document.getElementById('container').appendChild(infoDiv);
            // document.getElementById('container').append(table);
            document.getElementById('container').appendChild(subjectContainer);



        } else document.write("Error " + this.status);
    }
    xhr.send(JSON.stringify({
        "htno": `${document.getElementById("htno").value}`,
    }));

}

function allResults() {
    let htno = document.getElementById("htno").value;
    if (!htno) {
        alert("Enter hallticket number")
        return;
    }

    if (changed == 0) pushObjectsToTop();

    let xhr = new XMLHttpRequest();
    xhr.open('POST', "/all/", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {

        if (this.status == 200) {


            let data = JSON.parse(this.responseText);
            //deepcopy data into a variable called sems
            let sems = JSON.parse(JSON.stringify(data));


            let sgpas = []

            let subjects = []
            for (let sem of data) {
                for (let subject of sem.subjects) {
                    subjects.push(subject);
                }

                if (sem.subjects.length < 5) continue;

                let hasFailed = false;

                let credits = 0;
                let cg = 0;
                let gvdict = {
                    "O": 10,
                    "A+": 9,
                    "A": 8,
                    "B+": 7,
                    "B": 6,
                    "C": 5,
                    "F": 0
                };

                for (let subject of sem.subjects) {

                    if (subject.grade == 'F') {
                        let sameSubject = subjects.find(s => s.subjectCode == subject.subjectCode);
                        if (sameSubject) {
                            if (sameSubject.grade != 'F') {
                                credits += parseFloat(sameSubject['credits']);
                                cg += parseFloat(sameSubject['credits']) * parseInt(gvdict[sameSubject['grade']]);
                                let index = subjects.indexOf(subject);
                                subjects[index] = sameSubject;
                            } else {
                                hasFailed = true;
                                break;
                            }

                            // replace the subject with the new one

                        }
                    } else {
                        credits += parseFloat(subject['credits']);
                        cg += parseFloat(subject['credits']) * parseInt(gvdict[subject['grade']]);
                    }

                }
                let sgpa = hasFailed === true ? 0 : cg / credits;
                sgpas.push(sgpa);
            }
            let cgpa = 0;
            for (let sgpa of sgpas) {
                if (sgpa != 0)
                    cgpa += sgpa;
                else {
                    cgpa = 0;
                    break;
                }
            }
            cgpa /= sgpas.length;
            cgpa = cgpa.toFixed(2);

            //filter all items with no lab subjects from sems (all supplementary exams)
            sems = sems.filter((sem) => {
                for (let subject of sem.subjects)
                    if (subject.subjectCode[3].match(/[0-9]/)) return true;
                return false;
            });
            //replace all subjects with grade F in each sem with a subject with the same subject code but with a grade other than F from subjects array
            for (let sem of sems) {
                for (let subject of sem.subjects) {
                    if (subject.grade == 'F') {
                        let sameSubject = subjects.find(s => s.subjectCode == subject.subjectCode);
                        if (sameSubject) {
                            if (sameSubject.grade != 'F') {
                                let index = sem.subjects.indexOf(subject);
                                sem.subjects[index] = sameSubject;
                            }
                        }
                    }
                }
            }

            //add a field called sgpa to each sem object in sems
            for (let i = 0; i < sems.length; ++i) {
                sems[i].sgpa = sgpas[i];
            }

            //add a field called cgpa to sems
            sems.cgpa = cgpa;

            buildUI(sems);

        }

    }
    xhr.send(JSON.stringify({
        "htno": `${htno}`,
    }));

}

function buildUI(sems) {
    deleteElements();

    let infoDiv = document.createElement("div");
    infoDiv.id = 'infodiv';
    infoDiv.classList.add('infodiv');

    let nh = document.createElement('h1');
    nh.id = "name";
    nh.innerHTML = `${sems[0].name}`;
    infoDiv.appendChild(nh);

    let semslist = [
        "I Year I Semester",
        "I Year II Semester",
        "II Year I Semester",
        "II Year II Semester",
        "III Year I Semester",
        "III Year II Semester",
        "IV Year I Semester",
        "IV Year II Semester"
    ]

    let subjectContainers = [];
    // table.appendChild(headingrow);
    for (let sem of sems) {
        let subjectContainer = document.createElement("div");
        subjectContainer.classList.add('subjectcontainer');
        subjectContainer.id = `subjectcontainer${sems.indexOf(sem)}`;

        let sgpacontainer = document.createElement("div");
        sgpacontainer.classList.add('sgpacontainer');
        sgpacontainer.id = `sgpacontainer${sems.indexOf(sem)}`;

        let h1 = document.createElement("h2");
        h1.innerHTML = semslist[sems.indexOf(sem)];
        h1.classList.add('semname');
        sgpacontainer.appendChild(h1);

        let h2 = document.createElement("h2");
        h2.innerHTML = `<span class='sgpano'>${sem.sgpa == 0 ? 'No' : sem.sgpa.toFixed(2)}</span> SGPA`;
        h2.classList.add('sgpa');
        sgpacontainer.appendChild(h2);

        subjectContainer.appendChild(sgpacontainer);
        subjectContainers.push(subjectContainer);



        createSubjects(sem.subjects, subjectContainer);
    }

    if (document.getElementById('container').contains(document.getElementById('CGPA'))) {
        document.getElementById('container').removeChild(document.getElementById('CGPA'));
    }
    let CGPA = document.createElement("h1");
    CGPA.id = 'CGPA';
    CGPA.innerHTML = `${sems.cgpa > 0 ? sems.cgpa : "No"} <span class = "sgpa"> CGPA </span>`;

    infoDiv.appendChild(CGPA);
    document.getElementById('container').appendChild(infoDiv);
    // document.getElementById('container').append(table);
    for (let subjectContainer of subjectContainers) {
        document.getElementById('container').appendChild(subjectContainer);
    }
}

function createSubjects(subjects, subjectContainer, getSGPA = false) {
    let hasFailed = false;
    let totalCredits = 0;
    let cg = 0;
    for (let subject of subjects) {
        let subjectElement = document.createElement("div");
        subjectElement.classList.add("subject");
        h2s = []
        for (let i = 0; i < 4; ++i) {
            h2s.push(document.createElement("h2"));
        }

        if (subject.grade == 'F') hasFailed = true;

        h2s[0].innerHTML = subject.subjectCode ? subject.subjectCode : " ";
        h2s[0].classList.add('subjectCode');
        h2s[1].innerHTML = subject.subjectName ? toTitleCase(subject.subjectName, false) : " ";
        h2s[1].classList.add('subjectName');
        h2s[2].innerHTML = subject.total;
        h2s[3].innerHTML = subject.grade;
        h2s[3].classList.add('subjectGrade');

        for (let i = 0; i < 4; ++i) subjectElement.appendChild(h2s[i]);

        if (getSGPA && !hasFailed) {
            totalCredits += parseFloat(subject.credits)
            cg += parseInt(gradeToValue(subject.grade)) * parseFloat(subject.credits);

            if (subject.grade == 'F') hasFailed = true;
        }

        // table.appendChild(row);
        subjectContainer.appendChild(subjectElement);
    }
    return hasFailed ? 0 : cg / totalCredits;
}

function gradeToValue(str) {
    let gvdict = {
        "O": 10,
        "A+": 9,
        "A": 8,
        "B+": 7,
        "B": 6,
        "C": 5,
        "F": 0
    };
    return gvdict[str];
}

function something(rtext) {

    let data = JSON.parse(rtext);

    let table = document.createElement("table");
    let headingrow = document.createElement("tr");
    let headings = ["Subject Code", "Subject Name", "Internal Marks", "External Marks", "Total Marks", "Grade", "Credits"];
    headings.forEach(heading => {
        let headingcell = document.createElement("th");
        headingcell.innerHTML = heading;
        headingrow.appendChild(headingcell);
    });
    table.appendChild(headingrow);
    for (let i = 0; i < data.credits.length; i++) {
        let row = document.createElement("tr");
        let cells = [data.subjects[i], data.subjects[i], data.internal[i], data.external[i], data.total[i], data.grade[i], data.credits[i]];
        cells.forEach(cell => {
            let celldata = document.createElement("td");
            celldata.innerHTML = cell;
            row.appendChild(celldata);
        });
        table.appendChild(row);
    }

    document.body.appendChild(table);
}