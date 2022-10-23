const JSSoup = require('jssoup').default;
const axios = require('axios');
const fs = require('fs')

const url = "http://results.jntuh.ac.in/resultAction";

class subject {
    subjectCode = 0;
    subjectName;
    internal;
    external;
    total;
    grade;
    credits;

    constructor(subjectCode, subjectName, internal, external, total, grade, credits) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.grade = grade;
        this.credits = credits;
        this.internal = internal;
        this.external = external;
        this.total = total;
    }
}

function getAllResults(htno, callback) {
    //TODO: Implement
}

function getResults(htno, /*type = 'ra',*/ callback) {
    let config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding": "*"
            }
        }
        // let code = JSON.parse(fs.readFileSync(__dirname + '/data/codes.json'))["1-1"][0];

    //TODO: Change examcode and type to not be hardcoded    
    axios.post(url, {
            "degree": "btech",
            "etype": "r17",
            "result": "null",
            "grad": "null",
            "examCode": "1560",
            "type": "intgrade",
            "htno": `${htno}`
        }, config)
        .then(function(response) {
            let subjects = []
            let soup = new JSSoup(response.data);
            let tables = soup.findAll("table")
            let trs = tables[1].findAll("tr");
            let i = 0;
            trs.forEach(tr => {
                if (i == 0) {
                    ++i;
                    return;
                }
                let tds = tr.findAll("td");
                subjects.push(new subject(tds[0].text, tds[1].text, tds[2].text, tds[3].text, tds[4].text, tds[5].text, tds[6].text))
            });

            trs = tables[0].findAll("tr");
            tds = trs[0].findAll("td");

            let data = {
                "name": tds[3].text,
                "htno": tds[1].text,
                "subjects": subjects
            }

            callback(data);
        })
        .catch(function(error) {
            console.log(error);
        })
}

module.exports = {
    subject,
    getResults
}