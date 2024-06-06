import oss2
endpointPrivate = 'safeplateoss-1960489733425654.oss-cn-beijing-internal.oss-accesspoint.aliyuncs.com'
endpointPublic = 'safeplateoss-1960489733425654.oss-cn-beijing.oss-accesspoint.aliyuncs.com'
endpointGeneral = 'oss-cn-beijing.aliyuncs.com'
accessKeyId = 'LTAI5tDmcm8oGXEUzErYN4Dz'
accessKeySecret = '5FxhJIoSojAXH10IHk6UJ3nWp3PwQT'
bucketName = 'safeplate'
auth = oss2.Auth(accessKeyId,accessKeySecret)
bucket = oss2.Bucket(auth, endpointGeneral,bucketName)
objs = bucket.list_objects().object_list
# for item in objs:
#     print(item.key)
# print(help(oss2))

object_key = 'community/breast_cancer.pdf'
signed_url = bucket.sign_url('GET',object_key, 3600000)
print(signed_url)