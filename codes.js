const fs = require('fs')
const JSSoup = require('jssoup').default

url = 'http://results.jntuh.ac.in/jsp/home.jsp'

async function getExamCodes() {
    let x = new XMLHttpRequest();
    x.open('POST', url, true);
    x.onreadystatechange = () => {
        if (this.status == 200);
    }
}