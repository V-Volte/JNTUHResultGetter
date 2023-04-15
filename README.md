# JNTUHResultGetter

Get your results from the JNTUH database without having to struggle with the website crashing on results day.

## API
### Single result (only for batch of 2024)
Send a POST request to `result-getter.azurewebsites.net` with your hallticket number to recieve your results.
The POST request must be sent with `Content-Type: application/json`. You will recieve a JSON object with the data for the semester.

Example (REST):
```
POST http://result-getter.azurewebsites.net
Content-Type: application/json

{
    "htno": "20S11AXXXX"
}
```

#### Python (`requests`)
```python
import requests
results = requests.post('http://result-getter.azurewebsites.net', json={"htno": "20S11AXXXX"})
print(json.loads(results.content))
```

#### Node.js (`axios`)
```js
const axios = require('axios');
let data = axios.post('https://result-getter.azurewebsites.net/', {
    "htno": "20S11A6XXXX"
}, {
    headers: {
        "Content-Type": "application/json"
    }
}).then((res) => {
    console.log(res.data)
})
```

### All results
Send a POST request to `result-getter.azurewebsites.net/all` with your hallticket number to recieve your results.
The POST request must be sent with `Content-Type: application/json`. You will recieve a JSON object with the data for all the semesters.

Example (REST):
```
POST http://result-getter.azurewebsites.net/all

{
    "htno":"20S11AXXXX"
}
```
#### Python (`requests`)
```python
import requests
resultsdata = requests.post('http://result-getter.azurewebsites.net/all/', json={"htno": "20S11AXXXX"})
print(json.loads(resultsdata.content))
```

#### Node.js (`axios`)
```js
const axios = require('axios');
let data = axios.post('https://result-getter.azurewebsites.net/all/', {
    "htno": "20S11A6XXXX"
}, {
    headers: {
        "Content-Type": "application/json"
    }
}).then((res) => {
    console.log(res.data)
})
```