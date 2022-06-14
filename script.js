document.getElementById("htno").addEventListener("keypress", (e) => {
    if (e.code == 'Enter') {
        getResult();
    }
});

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

let changed = 0;

function getResult() {
    // let xhr = new XMLHttpRequest();
    // xhr.open('POST', "http://results.jntuh.ac.in/resultAction", true);
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhr.onreadystatechange = function() {
    //     if (this.status == 200) document.write(this.responseText)
    //     else document.write("Error " + this.status);
    // }
    // xhr.send("degree=btech&examCode=1560&etype=r17&result=null&grad=null&type=intgrade&htno=20S11A6611")
    // fetch("http://localhost:6969/", {
    //     method: "POST",
    //     headers: {
    //         "Content-type": "application/json",
    //     },
    //     body: {
    //         "htno": `${document.getElementById("htno").value}`,
    //     }
    // }).then(res => {
    //     console.log(res);
    //     document.write(res);
    // });

    let htno = document.getElementById("htno").value;
    if (!htno) alert("Enter hallticket number");

    let xhr = new XMLHttpRequest();
    xhr.open('POST', "/", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {

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

            if (document.body.contains(document.getElementById("cgpa"))) {
                document.getElementById("cgpa").remove();
            }

            let data = JSON.parse(this.responseText);
            let name = toTitleCase(data.name);
            let htno = data.htno;
            let nh = document.createElement('h1');
            nh.id = "name";
            nh.innerHTML = `${name}`;
            document.body.appendChild(nh);
            let nh2 = document.createElement('h2');
            nh2.innerHTML = `${htno}`;
            nh2.id = "htnoout";
            document.body.appendChild(nh2);
            let table = document.createElement("table");
            table.id = "table";
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
                let cells = [data.subcodes[i], data.subjnames[i], data.internal[i], data.external[i], data.total[i], data.grade[i], data.credits[i]];
                cells.forEach(cell => {
                    let celldata = document.createElement("td");
                    celldata.innerHTML = cell;
                    row.appendChild(celldata);
                });
                table.appendChild(row);
            }

            document.body.appendChild(table);
            let gvdict = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "F": 0 };
            let gct = 0;
            let ct = 0;
            for (let i = 0; i < data.credits.length; i++) {
                gct += parseFloat(data.credits[i]) * gvdict[data.grade[i]];
                ct += parseFloat(data.credits[i]);
            }

            let cgpa = gct / ct;
            let CGPA = document.createElement("h2");
            CGPA.innerHTML = `Your CGPA is ${cgpa.toFixed(2)}`;
            CGPA.id = "cgpa";
            document.body.appendChild(CGPA);

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