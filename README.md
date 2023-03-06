# JNTUHResultGetter

Get your results from the JNTUH database without having to struggle with the website crashing on results day.

## API
### Single result (only for batch of 2024)
Send a POST request to `result-getter.azurewebsites.com` with your hallticket number to recieve your results.
The POST request must be sent with `Content-Type: application/json`. You will recieve a JSON object with the data for the semester.

Example:
```
POST http://result-getter.azurewebsites.com
Content-Type: application/json

{
    "htno": "20S11AXXXX"
}
```
### All results
Send a POST request to `result-getter.azurewebsites.com/all` with your hallticket number to recieve your results.
The POST request must be sent with `Content-Type: application/json`. You will recieve a JSON object with the data for all the semesters.

Example:
```
POST http://result-getter.azurewebsites.com/all

{
    "htno":"20S11AXXXX"
}