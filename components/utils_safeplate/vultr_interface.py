import requests

def send_echo_request(prompt):
    url = "https://safeplatebackend.xyz/api/echo"
    payload = {"prompt": prompt}
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Failed with status code: {response.status_code}")

if __name__ == "__main__":
    prompt = "Hello, World!"
    send_echo_request(prompt)
