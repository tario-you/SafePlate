# 安装包：pip install bce-python-sdk
import copy
import json
from baidubce.auth import bce_credentials
from baidubce import bce_base_client, bce_client_configuration

AK = "qVXNW6WLhz68ZEcAkyyQRHso"
SK = "SqUCRGAMDDec9zR109gHpcjy8L16pxHb"
ENDPOINT = "https://bj.bcebos.com"

class Sample(bce_base_client.BceBaseClient):

    def __init__(self, config):
        self.config = copy.deepcopy(bce_client_configuration.DEFAULT_CONFIG)
        self.config.merge_non_none_values(config)

    def run(self):
        path = b'/v1/safeplate'
        headers = {
            b'Content-Type': 'application/json',
            b'Accept': 'application/json'
        }
        

        params = {}
        payload = json.dumps({
    "enableMultiAz": True
})

        return self._send_request(b'PUT', path, headers, params, payload)

if __name__ == '__main__':

    config = bce_client_configuration.BceClientConfiguration(credentials=bce_credentials.BceCredentials(AK, SK),
                                                                endpoint=ENDPOINT)
    client = Sample(config)
    res = client.run()
    print(res.__dict__)