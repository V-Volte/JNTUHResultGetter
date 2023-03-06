const fs = require('fs');
var JSSoup = require('jssoup').default;
const axios = require('axios');

url = 'http://results.jntuh.ac.in/jsp/home.jsp'

async function getExamCodes(callback) {
    //TODO: Implement
}

axios.get(url)
    .then(function (response) {
        getExamCodes(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {})

function getExamCodes(data) {
    let soup = new JSSoup(data);
    trs = soup.findAll('table')[0].findAll('tr');

    let codesDictionary = {
        "1-1": [],
        "1-2": [],
        "2-1": [],
        "2-2": [],
        "3-1": [],
        "3-2": [],
        "4-1": [],
        "4-2": []
    }

    let stringDictionary = {
        " I Year I ": "1-1",
        " I Year II": "1-2",
        " II Year I ": "2-1",
        " II Year II": "2-2",
        " III Year I ": "3-1",
        " III Year II": "3-2",
        " IV Year I ": "4-1",
        " IV Year II": "4-2"
    }


    trs.forEach(tr => {
        td = tr.findAll('td')[0];
        link = td.findAll('a')[0].attrs.href;

        if (td.text.includes('R18')) {
            codePos = link.search('examCode=');
            code = link.substring(codePos + 9, codePos + 13);

            for (let key in stringDictionary) {
                if (td.text.includes(key)) {
                    codesDictionary[stringDictionary[key]].push(code);
                    continue;
                }
            }
        }
    });

    if (!fs.existsSync(__dirname + '/data')) {
        fs.mkdirSync(__dirname + '/data');
    }

    fs.writeFile(__dirname + '/data/codes.json', JSON.stringify(codesDictionary), (err) => {
        if (err) {
            console.log(err)
        }
    })


}