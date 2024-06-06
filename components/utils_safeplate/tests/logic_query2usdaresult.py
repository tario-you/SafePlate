import requests
import json 
import re

barcode_oatmeal = {
  "code": 1,
  "msg": "操作成功",
  "data": {
    "barcode": "6924743911581",
    "brand": "QUAKER桂格",
    "goods_name": "桂格即食燕麦片400克",
    "company": "百事食品(中国)有限公司",
    "keyword": "桂格",
    "goods_type": "(食品、饮料和烟草>>谷类和豆类制品>>加工的谷类制品>>可直接食用和热的谷类食品)",
    "category_code": "50221201",
    "category_name": "",
    "image": "",
    "spec": "400克",
    "width": "13.1厘米",
    "height": "22.2厘米",
    "depth": "6厘米",
    "gross_weight": "422",
    "net_weight": "",
    "price": "10.80",
    "origin_country": "中国",
    "first_ship_date": "",
    "packaging_type": "",
    "shelf_life": "",
    "min_sales_unit": "1000（g）",
    "certification_standard": "",
    "certificate_license": "",
    "remark": ""
  }
}

query = """['Peanut', 'Nut', 'SmallJingSheng']
Note: 'SmallJingSheng' might not be a standard English food term, but it's included in the list as it seems to be a significant part of the product description. In a real-world scenario, we might need more contextual information or a more detailed product description to generate more accurate and relevant food database queries."""

terms = query[query.index('[')+1: query.index(']')]
terms = terms.split(', ')
terms = [x.replace("'", "") for x in terms]
term = terms[0]

apikey = 'wR1naEwdiP3YVOscrcfUOgLhYNz4TEQP7CgZawve'

url = "https://api.nal.usda.gov/fdc/v1/foods/search"
headers = {"Content-Type": "application/json"}
params = {"api_key": apikey}


print(f"querying {term}")
data = {"pageSize": 5, "query": term, }

response = requests.post(url, headers=headers, params=params, json=data)
print(response)

if response.status_code == 200:
    data = response.json()
    print("success")
else:
    print("Error:", response.status_code)

filtered_foods = []
all_nutrients = []

strings_to_replace = ['Total ', ', by difference', ', added', 'total ',',']
pattern = '|'.join(map(re.escape, strings_to_replace))

for food in data['foods']:
  if term.lower() in food['description'].lower():
    filtered_foods.append(food['description'])
    nutrients = ', '.join(list(set([re.sub(pattern, '', n['nutrientName']) for n in food['foodNutrients']])))
    all_nutrients.append(nutrients)
    break

choices = {filtered_foods[i] : all_nutrients[i] for i in range(len(filtered_foods))}

print(choices)

# choices -> display -> user chooses one -> choice 
# choice + user health information + "State in bullet points format, in separate categories 1) Titled Allergen alert(s) if potential allergens present in food is the same as the user profile [{"allergies": field listed}] 2) Titled Consumption alert(s) if an estimated calorie exceeds recommended intake for user profile BMI level 3) Titled Health alert if food is unsafe to consume scientifically based on user profile [{"Health Condition": field listed}] 4) Titled Scientific alert(s) if the food displayed have high toxicity, cannot be eaten together, or fall under other unsafe scenarios. Do not state the above alert(s) if no live conditions fall under a category."