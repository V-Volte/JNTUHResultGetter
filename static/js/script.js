document.getElementById("htno").addEventListener("keypress", (e) => {
    if (e.code == 'Enter') {
        getResult();
    }
});



function toTitleCase(text, isName) {
    if (isName == true) {
        return text.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    var i, j, str, lowers, uppers;
    str = text.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'
    ];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function(txt) {
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
    changed = 1;
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
    xhr.onreadystatechange = function() {

        // console.log(this.status)
        // console.log(this.responseText);

        if (this.status == 200 || this.status == 304) {

            if (document.body.contains(document.getElementById("table"))) {
                document.getElementById("table").remove();
            }

            if (document.body.contains(document.getElementById("name"))) {
                document.getElementById("name").remove();

            }

            if (document.body.contains(document.getElementById("htnoout"))) {
                document.getElementById("htnoout").remove();
            }

            if (document.body.contains(document.getElementById('subjectcontainer'))) {
                document.getElementById('subjectcontainer').remove();
            }

            if (document.body.contains(document.getElementById('infodiv'))) {
                document.getElementById('infodiv').remove();
            }

            let hasFailed = false;

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

            // let table = document.createElement("table");
            // table.id = "table";
            // let headingrow = document.createElement("tr");
            // let headings = ["Subject Code", "Subject Name", "Internal Marks", "External Marks", "Total Marks", "Grade", "Credits"];
            // headings.forEach(heading => {
            //     let headingcell = document.createElement("th");
            //     headingcell.innerHTML = heading;
            //     headingrow.appendChild(headingcell);
            // });

            let subjectContainer = document.createElement("div");
            subjectContainer.classList.add('subjectcontainer');
            subjectContainer.id = 'subjectcontainer';

            let cg = 0;
            let c = 0;
            let gvdict = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "F": 0 };

            // table.appendChild(headingrow);
            for (let subjecta in sdata) {
                console.log(subjecta);
                let subject = sdata[subjecta];
                //let row = document.createElement("tr");

                c += parseFloat(subject['credits']);
                cg += parseFloat(subject['credits']) * parseInt(gvdict[subject['grade']]);

                // for (let key in subject) {
                //     if (subject.hasOwnProperty(key)) {
                //         let cell = document.createElement("td");
                //         cell.innerHTML = (key == 'subjectName' ? toTitleCase(subject[key], false) : subject[key]);
                //         row.appendChild(cell);
                //     }
                // }

                let subjectElement = document.createElement("div");
                subjectElement.classList.add("subject");
                console.log(subject);
                h2s = []
                for (let i = 0; i < 4; ++i) {
                    h2s.push(document.createElement("h2"));
                }

                if (subject.grade == 'F') hasFailed = true;

                h2s[0].innerHTML = toTitleCase(subject.subjectName, false);
                h2s[0].classList.add('subjectName');
                h2s[1].innerHTML = subject.total;
                h2s[2].innerHTML = subject.grade;
                h2s[2].classList.add('subjectGrade');
                h2s[3].innerHTML = " ";

                for (let i = 0; i < 3; ++i) subjectElement.appendChild(h2s[i]);

                // table.appendChild(row);
                subjectContainer.appendChild(subjectElement);
            }

            let cgpa = cg / c;
            if (document.getElementById('container').contains(document.getElementById('CGPA'))) {
                document.getElementById('container').removeChild(document.getElementById('CGPA'));
            }
            let CGPA = document.createElement("h1");
            CGPA.id = 'CGPA';
            CGPA.innerHTML = `${hasFailed ? 'No' : cgpa.toFixed(2)} <span class = "sgpa"> SGPA </span>`;

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

function gradeToValue(str) {
    let gvdict = { "O": 10, "A+": 9, "A": 8.5, "B+": 8, "B": 7, "C": 6, "F": 0 };
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