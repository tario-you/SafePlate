
import requests
import json



def get_access_token():
    """
    使用 API Key，Secret Key 获取access_token，替换下列示例中的应用API Key、应用Secret Key
    """
    APIKey= 'XOS0HBk1W6XGGuYgJ3wkN12p'
    SecretKey= 'NsqVv8a56DLD6rIeRLT8VKPvA33vlPfG'
        
    url = f"https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id={APIKey}&client_secret={SecretKey}"
    
    payload = json.dumps("")
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    response = requests.request("POST", url, headers=headers, data=payload)
    access_token =  response.json().get("access_token")
    print(f'{access_token = }')
    return access_token

def main():   
    url = "https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1?access_token=" + get_access_token()
    
    q = '桂格即食燕麦片400克' # example: hello
    # For list of language codes, please refer to `https://ai.baidu.com/ai-doc/MT/4kqryjku9#语种列表`
    from_lang = 'zh' # example: en
    to_lang = 'en' # example: zh
    term_ids = '' # 术语库id，多个逗号隔开


    # Build request
    headers = {'Content-Type': 'application/json'}
    payload = {'q': q, 'from': from_lang, 'to': to_lang, 'termIds' : term_ids}
    
    r = requests.post(url, params=payload, headers=headers)
    result = r.json()

    # print(json.dumps(result, indent=4, ensure_ascii=False))
    print(result['result']['trans_result'][0]['dst'])

    

if __name__ == '__main__':
    main()
