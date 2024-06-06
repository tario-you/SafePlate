import axios from 'axios';
import {BosClient} from 'bce-sdk-js';
import i18n, {t} from 'i18next';
import React, {Component, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Button,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  CameraRoll,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CardView from 'react-native-cardview';
import ImagePicker from 'react-native-image-picker';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Mask,
  Path,
  Pattern,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Symbol,
  TSpan,
  TextPath,
  Use,
} from 'react-native-svg';
import {connect} from 'react-redux';
import BackButton from './BackButton';
import {setActiveUser, setPhoneNumber} from './actions';
import {sendData} from './utils_safeplate/vultr_interface.jsx';
const globalstyles = require('./GlobalStyles');
var RNFS = require('react-native-fs');

const baiduOssConfig = require('./baiduOssConfig');
const path = require('path');
const fs = require('react-native-level-fs');

const {Client} = require('./utils_safeplate/oss_analysis_client');

class CameraScreen extends Component {
  constructor({t}, props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      barcodeColor: '#ffffff',
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      barcodeDetected: false,
      imageReceived: false,
      pictureURI: '',
      gptFinalResponse: '',
    };

    this.barcodeKey = '243b5cadb9185b14e8c6be6c7ec3ee98';
  }

  async getAccessToken() {
    const baiduConfigs = {
      AppID: '64482952',
      APIKey: 'qVXNW6WLhz68ZEcAkyyQRHso',
      SecretKey: 'SqUCRGAMDDec9zR109gHpcjy8L16pxHb',
    };

    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${baiduConfigs.APIKey}&client_secret=${baiduConfigs.SecretKey}`;
    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      const accessToken = response.data.access_token;
      console.log(`access_token = ${accessToken}`);
      return accessToken;
    } catch (error) {
      console.error('Error fetching access token', error);
      return null;
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async onBarCodeRead(scanResult) {
    if (this.state.barcodeDetected || this.state.barcodeColor === '#aaaaaa') {
      return;
    }

    console.log(`${scanResult.type} ${scanResult.data}`);

    const apiUrl = 'https://api.tanshuapi.com/api/barcode/v1/index';
    const params = {
      key: '243b5cadb9185b14e8c6be6c7ec3ee98',
      barcode: scanResult.data,
    };

    const queryString = Object.keys(params)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]),
      )
      .join('&');

    fetch(apiUrl + '?' + queryString)
      .then(response => response.text())
      .then(responseText => {
        console.log('347');
        console.log(responseText); // Response from the API

        var llmResponse = this.callLLMAnalysis(null, responseText);
        this.setState({gptFinalResponse: llmResponse});

        this.setState({barcodeDetected: true});
      })
      .catch(error => {
        console.error(error);
      });
  }

  async handleGallerySelect() {
    const imageData = await CameraRoll.fetch({
      type: 'album',
      mediaType: 'image',
    });
    if (imageData.length > 0) {
      const base64EncodedImageData = Buffer.from(imageData[0].uri).toString(
        'base64',
      );

      var llmResponse = this.callLLMAnalysis(base64EncodedImageData, null);
      this.setState({gptFinalResponse: llmResponse});

      this.setState({imageReceived: true});
    } else {
      alert("Please select an image from your device's gallery");
    }
  }

  processGeminiResponse(response) {
    console.log("331, here's resposne: ");
    console.log(response);
    const output = response.data.result;

    let modified = output.substring(output.indexOf('1. '));
    modified = modified.replaceAll('\t', '');
    modified = modified.split('\n').filter(x => x !== '');
    console.log('439: ', modified);
    var end = modified.length;
    let start = modified
      .map((item, index) => ({item, index}))
      .filter(obj => obj.item.includes('3. '))
      .map(obj => obj.index)[0];
    for (var i = start; i < modified.length; i++) {
      let line = modified[i];
      if (line[0] != '*') {
        end = i;
        break;
      }
    }
    modified = modified.slice(0, end);
    modified = modified.join('\n');
    console.log('413: ', modified);
    modified = modified.replaceAll('* ', '').replaceAll('*', '');
    console.log('415: ', modified);

    var headers = [
      modified.substring(0, modified.indexOf('2. ') + 3),
      modified.substring(
        modified.indexOf('2. ') + 3,
        modified.indexOf('3. ') - 3,
      ),
      modified.substring(modified.indexOf('3. ') + 3),
    ];

    console.log('here are the headers');
    console.log(headers);

    return headers;
  }

  async callLLMAnalysis(image = null, barcode = null) {
    const prompt = this.getImagePrompt();

    if (image !== null) {
      var body = {prompt, image: image};
      axios
        .post('https:safeplatebackend.xyz/gemini_vision', body)
        .then(response => {
          console.log(response.data);
          processedResposne = processGeminiResponse(response.data);
          return processedResposne;
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      const accessToken = await this.getAccessToken();

      const gptUrl = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${accessToken}`;

      const payload = {
        messages: [{role: 'user', content: prompt}],
      };

      axios
        .post(gptUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log(response.data['result']);
          processedResposne = processGeminiResponse(response.data['result']);
          return processedResposne;
        })
        .catch(error => {
          console.error('Error occurred while fetching data:', error);
        });
    }
  }

  async getImagePrompt() {
    // 1. get user info
    // userInfo
    const {phoneNumber, activeUser} = this.props;
    const familyJSONpath = RNFS.DocumentDirectoryPath + '/users.json';
    const jsonData = await RNFS.readFile(familyJSONpath, 'utf8');
    console.log('jsonData hihi:', jsonData);
    const userData = JSON.parse(jsonData);
    var phoneUser = null;
    for (var i = 0; i < userData.length; i++) {
      user = userData[i];
      console.log(user);
      if (user.phonenumber === phoneNumber) {
        phoneUser = user;
        break;
      }
    }
    var memberInfo = null;
    if (phoneUser !== null) {
      for (var i = 0; i < phoneUser.members.length; i++) {
        const member = phoneUser.members[i];
        if (member.username === activeUser) {
          memberInfo = member;
          break;
        }
      }
    }
    console.log('userinfo hehehehe:');
    console.log(memberInfo);

    // 2. language determinant
    var languageDeterminant = '';
    if (i18n.language === 'en') {
      languageDeterminant = '请用英文回答：';
    } else if (i18n.language === 'ru') {
      languageDeterminant = '请用俄罗斯语回答：';
    } else if (i18n.language === 'sp') {
      languageDeterminant = '请用西班牙语回答：';
    } else if (i18n.language === 'tw') {
      languageDeterminant = '请用繁体中文回答：';
    } else if (i18n.language === 'fr') {
      languageDeterminant = '请用法语回答：';
    } else if (i18n.language === 'ar') {
      languageDeterminant = '请用阿拉伯语回答：';
    }

    promptEngineering = '你是一个食物安全，营养健康智能助理。';

    // 3. combine
    var gptQuery =
      promptEngineering +
      languageDeterminant +
      `Here's the user's health information: ${JSON.stringify(
        memberInfo,
      )}. Based on the results from the image, identify the product query information based on the retrieved code. Analyze 1) “Allergen” alert(s) if potential allergens present in food is the same as the user profile [{"allergies": field listed}] 2) “Consumption” alert(s) if an estimated calorie exceeds recommended intake for user profile BMI level 3) “Health” alert if food is unsafe to consume scientifically based on user profile [{"Health Condition": field listed}] 4) “Scientific” alert(s) if the food displayed have high toxicity, cannot be eaten together, or fall under other unsafe scenarios. Consider all factors statistically AND qualitatively with regard to BMI, health, weight, age, allergy conditions, health conditions, and all personal health data inputted. Refer to research and scientific data for these references. Always say you in reference to the user. Do not repeat health data and calculate BMI without telling the user this information. Focus on the image. Do not state the above alert(s) if no live conditions fall under a category. 

      After your analysis and concise compilation of the food based on user data, list out the three main health conditions that are most dangerous/important in the case. Put these health conditions in "Category:Term" format. Include embedded information within that explains more about the component present, how it is dangerous, and precautionary measures. Make sure to explain as much in detail as possible, but in bullet point format. 
      
      The example format goes as such, and you can conduct detailed analysis within:
      
      Allergen: Peanut
      
      Consumption: Excessive 
      
      Health: Diabetes
      
      DONT OUTPUT THE FOUR THINGS YOU ANALYZED. ONLY OUTPUT THE THREE MAIN HEALTH CONDITIONS YOU LISTED OUT.`;

    return gptQuery;
  }

  async takePicture() {
    if (!this.camera) {
      return;
    }

    sendData('hi');

    const options = {quality: 0.5, base64: true};

    this.camera
      .takePictureAsync(options)
      .then(data => {
        this.setState({pictureURI: data.uri});
        console.log(data.uri);

        var llmResponse = this.callLLMAnalysis(data.uri, null);
        this.setState({gptFinalResponse: llmResponse});

        this.setState({imageReceived: true});
      })
      .catch(error => {
        console.error('Error taking picture:', error);
      });

    // fetch test image from aliyun
    // const ak = 'qVXNW6WLhz68ZEcAkyyQRHso';
    // const sk = 'SqUCRGAMDDec9zR109gHpcjy8L16pxHb';
    // const object = 'test_dumpling.jpg';

    // previous attempt for img analysis
    /*
      const config = {
        endpoint: 'http://bos.bj.baidubce.com',
        credentials: {
          ak: 'qVXNW6WLhz68ZEcAkyyQRHso',
          sk: 'SqUCRGAMDDec9zR109gHpcjy8L16pxHb',
        },
      };
      

      let bucketName = 'safeplate';
      let objectName = 'img.jpg';
      let client = new BosClient(config);
      let uploadPath = data.uri;

      client
        .putObjectFromFile(bucketName, objectName, uploadPath)
        .then(response => {
          console.log('sucesss 44');
          console.log(response);
        })
        .catch(fail => {
          console.log('failure 44');
          console.log(fail);
        });*/
  }

  pendingView() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightgreen',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Waiting</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.barcodeDetected ? (
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            onBarCodeRead={this.onBarCodeRead.bind(this)}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            androidCameraPermissionOptions={{
              title: 'Camera Permission',
              message:
                'Safeplate needs access to your camera to scan your food / barcodes',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Deny',
              buttonPositive: 'Allow',
            }}
            captureAudio={false}
            style={styles.preview}
            type={this.state.camera.type}
          />
        ) : (
          <Image
            source={{uri: this.state.pictureURI}} // Replace with your image source
            style={styles.detectedImage}
          />
        )}
        <View style={[styles.overlay, styles.topOverlay]}>
          <View style={globalstyles.topMargin} />
          <View style={globalstyles.topMargin} />
          <View style={globalstyles.topMargin} />

          <View style={{paddingTop: 10, zIndex: 3}}>
            <BackButton fillColor="#ffffff" />
          </View>

          <View style={globalstyles.marginLeft} />
          <View>
            <Text
              style={[
                globalstyles.headerTitle,
                globalstyles.outfit,
                {
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: 40,
                  paddingLeft: 20,
                  zIndex: 3,
                },
              ]}>
              {t('HomeScreen.Scan')}
            </Text>
          </View>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          <TouchableOpacity
            onPress={() => {
              this.handleGallerySelect();
            }}
            style={{
              padding: 15,
              alignItems: 'center',
              marginHorizontal: 30,
              justifyContent: 'center',
            }}>
            <Svg
              version="1.1"
              width="50"
              height="50"
              x="0"
              y="0"
              viewBox="0 0 24 24"
              style="enable-background:new 0 0 512 512"
              class="">
              <G>
                <G data-name="Layer 52">
                  <Path
                    d="M18 1.25H6A4.75 4.75 0 0 0 1.25 6v12a.09.09 0 0 0 0 .05A4.75 4.75 0 0 0 6 22.75h12a4.75 4.75 0 0 0 4.74-4.68V6A4.75 4.75 0 0 0 18 1.25zM21.25 16l-4.18-4.78a2.84 2.84 0 0 0-4.14 0l-2.87 3.28-.94-1.14a2.76 2.76 0 0 0-4.24 0l-2.13 2.57V6A3.26 3.26 0 0 1 6 2.75h12A3.26 3.26 0 0 1 21.25 6z"
                    fill="#ffffff"
                    opacity="1"
                    data-original="#000000"
                    class=""></Path>
                  <Circle
                    cx="7"
                    cy="7"
                    r="2"
                    fill="#ffffff"
                    opacity="1"
                    data-original="#000000"
                    class=""></Circle>
                </G>
              </G>
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.takePicture();
              console.log('scan clicked');
            }}
            style={{
              padding: 15,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 30,
            }}>
            {/* camera */}
            <Svg
              version="1.1"
              width="50"
              height="50"
              x="0"
              y="0"
              viewBox="0 0 36.174 36.174"
              style="enable-background:new 0 0 512 512"
              class="">
              <G>
                <Path
                  d="M23.921 20.528c0 3.217-2.617 5.834-5.834 5.834s-5.833-2.617-5.833-5.834 2.616-5.834 5.833-5.834 5.834 2.618 5.834 5.834zm12.253-8.284v16.57a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-16.57a4 4 0 0 1 4-4h4.92V6.86a3.5 3.5 0 0 1 3.5-3.5h11.334a3.5 3.5 0 0 1 3.5 3.5v1.383h4.92c2.209.001 4 1.792 4 4.001zm-9.253 8.284c0-4.871-3.963-8.834-8.834-8.834-4.87 0-8.833 3.963-8.833 8.834s3.963 8.834 8.833 8.834c4.871 0 8.834-3.963 8.834-8.834z"
                  fill="#ffffff"
                  opacity="1"
                  data-original="#000000"
                />
              </G>
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.state.barcodeColor === '#ffffff') {
                this.setState({barcodeColor: '#aaaaaa'});
              } else {
                this.setState({barcodeColor: '#ffffff'});
              }
            }}
            style={{
              padding: 15,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              marginHorizontal: 30,
            }}>
            {/* barcode svg */}
            <Svg
              version="1.1"
              width="50"
              height="50"
              x="0"
              y="0"
              viewBox="0 0 426.667 426"
              style="enable-background:new 0 0 512 512"
              class="">
              <G>
                <Path
                  d="M74.668.332h-64C4.778.332 0 5.109 0 11v64c0 5.89 4.777 10.668 10.668 10.668S21.332 80.891 21.332 75V21.668h53.336c5.89 0 10.664-4.777 10.664-10.668S80.559.332 74.668.332zM74.668 320.332H21.332V267c0-5.89-4.773-10.668-10.664-10.668S0 261.109 0 267v64c0 5.89 4.777 10.668 10.668 10.668h64c5.89 0 10.664-4.777 10.664-10.668s-4.773-10.668-10.664-10.668zM416 .332h-64c-5.89 0-10.668 4.777-10.668 10.668S346.109 21.668 352 21.668h53.332V75c0 5.89 4.777 10.668 10.668 10.668S426.668 80.891 426.668 75V11c0-5.89-4.777-10.668-10.668-10.668zM416 256.332c-5.89 0-10.668 4.777-10.668 10.668v53.332H352c-5.89 0-10.668 4.777-10.668 10.668s4.777 10.668 10.668 10.668h64c5.89 0 10.668-4.777 10.668-10.668v-64c0-5.89-4.777-10.668-10.668-10.668zM74.668 64.332C68.778 64.332 64 69.109 64 75v192c0 5.89 4.777 10.668 10.668 10.668S85.332 272.891 85.332 267V75c0-5.89-4.773-10.668-10.664-10.668zM117.332 64.332h21.336c5.89 0 10.664 4.777 10.664 10.668v192c0 5.89-4.773 10.668-10.664 10.668h-21.336c-5.89 0-10.664-4.777-10.664-10.668V75c0-5.89 4.773-10.668 10.664-10.668zM181.332 64.332c-5.89 0-10.664 4.777-10.664 10.668v192c0 5.89 4.773 10.668 10.664 10.668S192 272.891 192 267V75c0-5.89-4.777-10.668-10.668-10.668zM224 64.332h21.332C251.222 64.332 256 69.109 256 75v192c0 5.89-4.777 10.668-10.668 10.668H224c-5.89 0-10.668-4.777-10.668-10.668V75c0-5.89 4.777-10.668 10.668-10.668zM288 64.332c-5.89 0-10.668 4.777-10.668 10.668v192c0 5.89 4.777 10.668 10.668 10.668s10.668-4.777 10.668-10.668V75c0-5.89-4.777-10.668-10.668-10.668zM330.668 64.332H352c5.89 0 10.668 4.777 10.668 10.668v192c0 5.89-4.777 10.668-10.668 10.668h-21.332c-5.89 0-10.668-4.777-10.668-10.668V75c0-5.89 4.777-10.668 10.668-10.668zm0 0"
                  fill={this.state.barcodeColor}
                  opacity="1"
                  data-original="#000000"
                  class=""></Path>
              </G>
            </Svg>
          </TouchableOpacity>
        </View>

        {(this.state.barcodeDetected || this.state.imageReceived) && (
          <View style={styles.overlayInfo}>
            <View style={[{width: '80%'}]}>
              <Text
                style={[
                  globalstyles.headerTitle,
                  globalstyles.outfit,
                  {
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: 40,
                    // paddingLeft: 10,
                  },
                ]}>
                Results
              </Text>
              {this.state.gptFinalResponse === '' && (
                <View>
                  <Text style={[{color: '#ffffff'}, globalstyles.outfit]}>
                    consulting AI...
                  </Text>
                </View>
              )}
              {this.state.gptFinalResponse !== '' && (
                <View>
                  <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    style={{
                      // marginBottom: 40,
                      height: '85%',
                      borderRadius: 12,
                      padding: 10,
                      backgroundColor: '#ffffff',
                    }}>
                    <Text
                      style={[
                        {
                          color: '#000000',
                          fontSize: 15,
                          fontFamily: 'Outfit-VariableFont_wght',
                        },
                      ]}>
                      {this.state.gptFinalResponse.replace(/\*/g, '')}
                    </Text>
                    <View style={{height: 20}} />
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        )}

        {this.state.barcodeDetected && (
          <TouchableOpacity
            style={styles.clickBackOverlay}
            onPress={() => {
              this.setState({barcodeDetected: false});
              this.setState({imageReceived: false});
              this.setState({gptFinalResponse: ''});
            }}>
            <View style={[{width: '80%'}]}>
              <Text
                style={[
                  {
                    color: '#eeeeee',
                    textAlign: 'center',
                  },
                  globalstyles.outfit,
                ]}>
                click here to scan another
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = {
  prevChatButton: {
    backgroundColor: 'white', // Adjust colors accordingly
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    minWidth: 120,
  },
  clickBackOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    height: '60%',
    top: 0,
    right: 0,
    left: 0,
  },
  overlayInfo: {
    position: 'absolute',
    backgroundColor: '#a186e6', // orange
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    height: '50%',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  detectedImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    // alignItems: 'center',
    flexDirection: 'column',
  },
  topOverlay: {
    // top: 0,
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  bottomOverlay: {
    bottom: '10%',
    // backgroundColor: 'rgba(0,0,0,0.7)',
    width: '80%',
    left: '10%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hstack: {
    // position: 'absolute',
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items vertically
    // justifyContent: 'space-between', // Align items with equal space between them
    // marginLeft: '5%', // Add left margin to create space from the left edge of the screen
    // marginRight: '7%', // Add right margin to create space from the right edge of the screen
  },
};

const mapStateToProps = state => ({
  phoneNumber: state.phoneNumber,
  activeUser: state.activeUser,
});

const mapDispatchToProps = {
  setPhoneNumber,
  setActiveUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
