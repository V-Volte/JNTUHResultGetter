import requests
import sys
import pandas as pd
import json
from bs4 import BeautifulSoup


url = "http://results.jntuh.ac.in/resultAction"
data = f"degree=btech&etype=r17&result=null&grad=null&type=intgrade&htno={sys.argv[1]}&examCode=1560"
headers = {
    "Content-type": "application/x-www-form-urlencoded",
    "Host": "results.jntuh.ac.in",
            "Origin": "results.jntuh.ac.in",

}
x = requests.post(url, data=data, headers=headers)
# print(x.status_code)
# print(x.text)
v = x.text
# f = open('response.txt', 'w')
# f.write(x.text)
# f.close()
soup = BeautifulSoup(v, 'lxml')

tables = pd.read_html(x.text)
reqtab = tables[0]
reqtab2 = tables[1]

tables = soup.find_all("table")

trs = tables[1].find_all("tr")

subjects = {}

snos = []
subcodes = []
subjnames = []
grade = []
credits = []
internal = []
external = []
total = []
i = 0
for tr in trs:
    if i != 0:
        tds = tr.find_all("td")

        subjects[tds[0].text] = [tds[1].text + tds[2].text + tds[3].text + tds[4].text + tds[5].text + tds[6].text]

        # subcodes.append(tds[0].text)
        # subjnames.append(tds[1].text)
        # internal.append(tds[2].text)
        # external.append(tds[3].text)
        # total.append(tds[4].text)
        # grade.append(tds[5].text)
        # credits.append(tds[6].text)
    i += 1


jsonstr = ''
jsonstr += '{'
jsonstr += '"snos":' + json.dumps(snos) + ','
jsonstr += '"subcodes":' + json.dumps(subcodes) + ','
jsonstr += '"subjnames":' + json.dumps(subjnames) + ','
jsonstr += '"internal":' + json.dumps(internal) + ','
jsonstr += '"external":' + json.dumps(external) + ','
jsonstr += '"total":' + json.dumps(total) + ','
jsonstr += '"grade":' + json.dumps(grade) + ','
trs = tables[0].find_all("tr")
tds = trs[0].find_all("td")

jsonstr += '"credits":' + json.dumps(credits) + ','
jsonstr += '"name" : ' + json.dumps(tds[3].text) + ','
jsonstr += '"htno" : ' + json.dumps(tds[1].text) + '}'

print(jsonstr)
sys.stdout.flush()
# f = open('reqtab.json', 'w');
# f.write(jsonstr);
# f.close();
