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

barcode_peanuts={"code":1,"msg":"操作成功","data":{"barcode":"6948235706066","brand":"塞翁福","goods_name":"160g小京生","company":"上海塞翁福农业发展有限公司","keyword":"","goods_type":"","category_code":"10000612","category_name":"零食组合装","image":"","spec":"160g\/袋","width":"","height":"","depth":"","gross_weight":"","net_weight":"","price":"","origin_country":"中国","first_ship_date":"","packaging_type":"","shelf_life":"","min_sales_unit":"","certification_standard":"","certificate_license":"","remark":""}}

gpt_query = "Example:\nQuery:\nGenerate an array of length 3 of single-word food database queries for the name of the food (not the brand) that can help find the matching food for a food of the description: QUAKER桂格, 桂格即食燕麦片400克, 百事食品(中国)有限公司, 桂格, (食品、饮料和烟草>>谷类和豆类制品>>加工的谷类制品>>可直接食用和热的谷类食品)\nResult:\n['Oatmeal', 'Cereal', 'Oat']\nNow, use that format I just demonstrated to answer this query:\nGenerate an array of length 3 of single-word food database queries for the name of the food (not the brand) that can help find the matching food for a food of the description:"
for item in [v for k,v in barcode_peanuts['data'].items() if k in ['brand', 'goods_name', 'company','keyword','goods_type']]:
    if item != '':
        gpt_query += item + ", "
gpt_query = gpt_query[:-2]

# return gpt_query -> chatscreen.jsx callAPI functionality, but not chat, just a single completion, so modify a bit