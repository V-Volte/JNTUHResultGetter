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
let codes = JSON.parse(fs.readFileSync(__dirname + '/data/codes.json'));

function getSubjects(input) {
    try {
        let subjects = []
        let soup = new JSSoup(input.data);
        
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

        return {
            "name": tds[3].text,
            "htno": tds[1].text,
            "subjects": subjects
        }
    } catch (err) {
        console.log(err);
        return "PlaceholderSubject";
    }
}



const config = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "*"
    }
}

function getResults(htno, /*type = 'ra',*/ callback, examcode = 1645) {
    axios.post(url, {
            "degree": "btech",
            "etype": "r17",
            "result": "null",
            "grad": "null",
            "examCode": `${examcode}`,
            "type": "intgrade",
            "htno": `${htno}`
        }, config)
        .then(function (response) {

            callback(getSubjects(response));
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function getAllResults(htno) {

    try {

    let promises = []

    for (let key in codes) {
        for (let nkey in codes[key]) {
            promises.push(
                axios.post(url, {
                    "degree": "btech",
                    "etype": "r17",
                    "result": "null",
                    "grad": "null",
                    "examCode": `${codes[key][nkey]}`,
                    "type": "intgrade",
                    "htno": `${htno}`
                }, config)
            )
            promises.push(
                axios.post(url, {
                    "degree": "btech",
                    "etype": "r17",
                    "result": "gradercrv",
                    "grad": "null",
                    "examCode": `${codes[key][nkey]}`,
                    "type": "rcrvintgrade",
                    "htno": `${htno}`
                }, config)
            )
        }
    }


    let results = await Promise.all(promises);

    // Filter out all results with content-length 3774 (results homepage)
    results = results.filter((result) => {
        return result.headers['content-length'] != 3774 ;
    })

    let resultsdata = []

    for (let result in results) {
        resultsdata.push(getSubjects(results[result]))
    }

    console.log(resultsdata.length);

    //Remove all "PlaceholderSubject" results
    resultsdata = resultsdata.filter((result) => {
        return result != "PlaceholderSubject";
    })

    console.log("Resultsdata");
    for (let result of resultsdata) console.log(result);
    console.log("End Resultsdata");
    console.log(resultsdata.length);

    ret = []
    xv = []

    // remove duplicates in results
    for (let result in resultsdata) {
        if (!xv.includes(JSON.stringify(resultsdata[result])) && result != undefined && !ret.includes(resultsdata[result])) {
            ret.push(resultsdata[result])
            xv.push(JSON.stringify(resultsdata[result]))
        }
    }

    } catch (err) {
        console.log("Err" + err)
    }

    return ret
}

// TODO: Implement this
// Should set every subject data to its most recent result
function normalizeData(data, callback) {
    let normalized = {};
    for (let key in data) {

    }
}


module.exports = {
    subject,
    getResults,
    getAllResults,
}

// Here because I can't get myself to delete this after struggling with it for hours
async function __legacy__getAllResults(htno, callback) {
    let config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "*"
        }
    }


    let results = new Map();
    let i = 0;
    for (let key in codes) {
        //let code = codes[key][0];
        for (let nkey in codes[key]) {
            let code = codes[key][nkey]
            //console.log(code)
            axios.post(url, {
                    "degree": "btech",
                    "etype": "r17",
                    "result": "null",
                    "grad": "null",
                    "examCode": `${code}`,
                    "type": "intgrade",
                    "htno": `${htno}`
                }, config)
                .then(async function (response) {
                    //console.log(response.status)
                    let subjects = []
                    let soup = new JSSoup(response.data);
                    let tables = soup.findAll("table")
                    //console.log("===============")
                    //console.log(tables.toString())
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

                    results.set(key, data);
                    callback(key, data);
                    ++i;
                    // if (i == Object.keys(codes).length) {
                    //     callback(results);
                    // }
                })
                .catch(function (error) {
                    //console.error(error);
                })
        }

    }

    return results;

    //callback(results);

    // wait for 2 seconds
    //await new Promise(resolve => setTimeout(resolve, 1500));

    //callback(results);
}