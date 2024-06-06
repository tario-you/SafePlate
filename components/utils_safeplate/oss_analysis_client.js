'use strict';
// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const imm20200930 = require('@alicloud/imm20200930');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');
const Tea = require('@alicloud/tea-typescript');

class Client {
  /**
   * 使用AK&SK初始化账号Client
   * @return Client
   * @throws Exception
   */
  static createClient() {
    // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考。
    // 建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html。
    let config = new OpenApi.Config({
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
      accessKeyId: 'qVXNW6WLhz68ZEcAkyyQRHso', // process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'],
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
      accessKeySecret: 'SqUCRGAMDDec9zR109gHpcjy8L16pxHb',
    });
    // Endpoint 请参考 https://api.aliyun.com/product/imm
    config.endpoint = `imm.cn-beijing.aliyuncs.com`;
    return new imm20200930.default(config);
  }

  static async detectImageLabels(object) {
    let client = Client.createClient();
    let detectImageLabelsRequest = new imm20200930.DetectImageLabelsRequest({
      projectName: 'safeplate_img',
      sourceURI: `oss://safeplate/${object}`,
    });
    let runtime = new Util.RuntimeOptions({});
    try {
      // 复制代码运行请自行打印 API 的返回值
      const response = await client.detectImageLabelsWithOptions(
        detectImageLabelsRequest,
        runtime,
      );
      console.log('YIPE: ');
      console.log(response.body); // Printing the response body
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      // 诊断地址
      console.log(error.data['Recommend']);
      Util.default.assertAsString(error.message);
    }
  }
}

exports.Client = Client;
