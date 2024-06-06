import requests

# http://api.tanshuapi.com/api/barcode/v1/index?key=243b5cadb9185b14e8c6be6c7ec3ee98&barcode=6906337301091

url = "http://api.tanshuapi.com/api/barcode/v1/index"
bcpeanuts = '6948235706066'
bcquaker = "6924743911581"
params = {
    "key": "243b5cadb9185b14e8c6be6c7ec3ee98",
    "barcode": bcpeanuts
}

response = requests.get(url, params=params)
print(response.text)
