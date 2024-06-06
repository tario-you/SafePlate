import requests

url = "https://api.nal.usda.gov/fdc/v1/foods/search"
params = {
    "api_key": "wR1naEwdiP3YVOscrcfUOgLhYNz4TEQP7CgZawve",
    "q": "京生"
}

response = requests.get(url, params=params)

print(response.headers)

p = {'Date': 'Wed, 01 May 2024 13:06:37 GMT', 'Content-Type': 'application/json;charset=UTF-8', 'Transfer-Encoding': 'chunked', 'Connection': 'keep-alive', 'Access-Control-Allow-Methods': 'POST,  GET, OPTIONS', 'Access-Control-Allow-Origin': '*', 'Age': '1', 'Content-Encoding': 'gzip', 'Set-Cookie': 'ApplicationGatewayAffinityCORS=50338e381d6b5be775f36f07abdc605f; Path=/; SameSite=None; Secure, ApplicationGatewayAffinity=50338e381d6b5be775f36f07abdc605f; Path=/', 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload, max-age=31536000; includeSubDomains; preload', 'Vary': 'Accept-Encoding', 'Via': 'https/1.1 api-umbrella (ApacheTrafficServer [cMsSf ])', 'X-Api-Umbrella-Request-Id': 'cf6h1pkvsp0q6biqi5cg', 'X-Cache': 'MISS', 'X-Content-Type-Options': 'nosniff', 'X-Ratelimit-Limit': '3600', 'X-Ratelimit-Remaining': '3584', 'X-Vcap-Request-Id': 'c856f994-5d26-4466-7bf6-bf3111ec39da', 'X-Xss-Protection': '1; mode=block', 'X-Frame-Options': 'sameorigin'}


# curl -X GET -G https://api.nal.usda.gov/fdc/v1/foods/search -d "api_key=wR1naEwdiP3YVOscrcfUOgLhYNz4TEQP7CgZawve" -d "q=broccoli" -v

