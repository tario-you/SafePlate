import requests
import json 

apikey = 'wR1naEwdiP3YVOscrcfUOgLhYNz4TEQP7CgZawve'

url = "https://api.nal.usda.gov/fdc/v1/foods/list"
headers = {"Content-Type": "application/json"}

params = {"api_key": apikey}


page_number = 1
all_data = []

while True:
    print(f"fetching {page_number}")
    data = {"pageSize": 200, "pageNumber":page_number}

    response = requests.post(url, headers=headers, params=params, json=data)

    if response.status_code == 200:
        data = response.json()
        if data:
            all_data.extend(data)
            page_number += 1
        else:
            break
    else:
        print("Error:", response.status_code)
        break

with open("components/response2.json", "w") as json_file:
    json.dump(all_data, json_file, indent=4)

