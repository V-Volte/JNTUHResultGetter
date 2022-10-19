# JNTUHResultGetter

Get your results from the JNTUH database without having to struggle with the website crashing on results day.

## API
Send a POST request to `result-getter.herokuapp.com` with your hallticket number to recieve your results.
The POST request must be sent with `Content-Type: application/json`. You will recieve a JSON object with the data for the semester.

Example:
```
POST http://result-getter.herokuapp.com
Content-Type: application/json

{
    "htno": "20S11AXXXX"
}
```
