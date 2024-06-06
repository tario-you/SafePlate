
import requests
import json



def get_access_token():
    """
    使用 API Key，Secret Key 获取access_token，替换下列示例中的应用API Key、应用Secret Key
    """
    APIKey= 'qVXNW6WLhz68ZEcAkyyQRHso'
    SecretKey= 'SqUCRGAMDDec9zR109gHpcjy8L16pxHb'
        
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
    url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=" + get_access_token()
    
    payload = json.dumps({
        "messages": [
            {
                "role": "user",
                "content": "给我推荐一些自驾游路线"
            }
        ],
         "stream": True
    })
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.request("POST", url, headers=headers, data=payload, stream=True)
    
    for line in response.iter_lines():
        print(line.decode("UTF-8"))
    

if __name__ == '__main__':
    main()
