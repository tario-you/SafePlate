import AliyunOSS from 'aliyun-oss-react-native';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
// import EventSource from 'react-native-sse';
import Svg, {Defs, G, Path, Pattern, Rect} from 'react-native-svg';
import BackButton from './BackButton';
var RNFS = require('react-native-fs');
const globalstyles = require('./GlobalStyles');

import {connect} from 'react-redux';
import {setActiveUser, setPhoneNumber} from './actions';

const ChatScreen = ({
  navigation,
  phoneNumber,
  activeUser,
  setPhoneNumber,
  setActiveUser,
}) => {
  // const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const [pastConversations, setPastConversations] = useState([]);
  const [curConvID, setCurConvID] = useState(0);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [textInputBottom, setTextInputBottom] = useState(new Animated.Value(4));
  const screenHeight = Dimensions.get('window').height;

  var regexRemoves = [
    '请用英文回答：',
    '请用俄罗斯语回答：',
    '你是一个食物安全，营养健康智能助理。',
  ];

  const conversationsJSONpath =
    RNFS.DocumentDirectoryPath + '/conversations.json';

  const baiduConfigs = {
    AppID: '64482952',
    APIKey: 'qVXNW6WLhz68ZEcAkyyQRHso',
    SecretKey: 'SqUCRGAMDDec9zR109gHpcjy8L16pxHb',
  };

  const readFromJSON = async readFromAliyun => {
    try {
      if (readFromAliyun) {
        AliyunOSS.asyncDownload('safeplate', 'conversations.json')
          .then(e => {
            console.log('successfully downloaded from conversations.json');
            console.log(e);
          })
          .catch(e => {
            console.log('failed to download :(');
            console.log(e);
          });

        const jsonData = await RNFS.readFile(conversationsJSONpath, 'utf8');
        const data = JSON.parse(jsonData);
        console.log('typeof ehre');
        console.log(typeof data);
        return data;
      } else {
        return null;
      }
      // setPastConversations(data);
    } catch (error) {
      console.error('Error reading data from conversations.json:', error);
    }
  };

  const fetchData = async (downloadFile = true) => {
    const data = await readFromJSON(downloadFile);

    if (data !== null) {
      var foundItem = null;
      for (var i = 0; i < data.length; i++) {
        item = data[i];
        console.log(item['phonenumber']);
        if (item['phonenumber'] === phoneNumber) {
          foundItem = item;
          break;
        }
      }

      if (foundItem['phonenumber'] === phoneNumber) {
        setPastConversations(foundItem['chats']);

        console.log('fetched converstaions.json data:', pastConversations);

        pastConversations.forEach(function (item) {
          console.log('item should be here');
          console.log(item['title']);
        });
      }
    } else {
      const jsonData = await RNFS.readFile(conversationsJSONpath, 'utf8');
      const data = JSON.parse(jsonData);
      console.log('typeof ehre');
      console.log(typeof data);

      var foundItem = null;
      data.forEach(function (item) {
        console.log(item['phonenumber']);
        if (item['phonenumber'] === phoneNumber) {
          foundItem = item;
          return;
        }
      });

      if (foundItem['phonenumber'] === phoneNumber) {
        setPastConversations(foundItem['chats']);

        console.log('fetched converstaions.json data:', pastConversations);

        pastConversations.forEach(function (item) {
          console.log('item should be here');
          console.log(item['title']);
        });
      }
    }
  };

  useEffect(() => {
    const configuration = {
      maxRetryCount: 3,
      timeoutIntervalForRequest: 30,
      timeoutIntervalForResource: 24 * 60 * 60,
    };

    const endpoint = 'oss-cn-beijing.aliyuncs.com';
    const accessKeyId = 'LTAI5tDmcm8oGXEUzErYN4Dz';
    const accessKeySecret = '5FxhJIoSojAXH10IHk6UJ3nWp3PwQT';

    AliyunOSS.initWithPlainTextAccessKey(
      accessKeyId,
      accessKeySecret,
      endpoint,
      configuration,
    );

    fetchData();
    console.log(`the active user is ${activeUser}`);

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        const keyboardHeight = event.endCoordinates.height;
        const bottomPercentage = (keyboardHeight / screenHeight) * 100;
        Animated.timing(textInputBottom, {
          toValue: bottomPercentage,
          duration: 0,
          useNativeDriver: false,
        }).start(() => {
          setTimeout(() => {
            scrollViewRef.current.scrollToEnd({animated: true});
          }, 100);
        });
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(textInputBottom, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }).start();
      },
    );

    // Clean up the listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    // Scroll to the end when messages change
    scrollViewRef.current.scrollToEnd({animated: true});
  }, [messages]);

  // useEffect(() => {
  // console.log(i18n.language);
  // });

  const getAccessToken = async () => {
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
  };

  const callAPI = async () => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${accessToken}`;

      console.log('sending payload of');
      const payload = {
        messages: messages.slice(0, -1),
        // stream: true,
      };
      console.log(payload);

      try {
        // axios({
        //   url: url,
        //   data: payload,
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   method: 'POST',
        //   onDownloadProgress: progressEvent => {
        //     const xhr = progressEvent.target;
        //     // const {responseText} = xhr;
        //     console.log('=====responseText======');
        //     console.log(progressEvent);
        //     console.log(xhr);
        //   },
        // });

        const response = await axios.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        /*
        const es = new EventSource(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: {
            messages: messages,
            stream: true,
          },
          debug: true,
          pollingInterval: 0,
          lineEndingCharacter: '\n',
        });

        es.addEventListener('open', () => {
          setMessages(prevMessages => [
            ...prevMessages,
            {text: '...', isQuery: false},
          ]);
          console.log('Open SSE connection.');
        });

        es.addEventListener('message', event => {
          console.log('New message event:', event.data);
        });
        es.addEventListener('message', event => {
          console.log('New message event:', event.data);
          try {
            const data = JSON.parse(event.data);
            console.log('Received data:', data);
            // Update your state or handle the data as needed
            setMessages(prevMessages => [
              ...prevMessages,
              {text: data.message, isQuery: false},
            ]);
          } catch (error) {
            console.error('Error parsing event data', error);
          }
        });

        es.addEventListener('error', event => {
          console.error('SSE Error:', event.data);
        });

        es.addEventListener('close', event => {
          console.log('Close SSE connection.');
        });
        */
        // var dataArray = output.split('\ndata: ');

        const output = response.data;
        // console.log(output.result);

        // console.log(`typeof response ${typeof response}`);
        // console.log(`typeof output ${typeof output}`);
        // console.log(`response data: ${response}`);
        // console.log(response);
        // console.log(`response data: ${output}`);
        // console.log(output);
        // console.log(`length : ${output.length}`);

        // console.log('this should be line by line pog output');

        const updatedMessages = [...messages];
        setMessage({role: 'assistant', content: output.result});
        updatedMessages.pop();
        updatedMessages.push({role: 'assistant', content: output.result});
        setMessages(updatedMessages);

        // write to conversations.json
        // for (var i = 1; i < dataArray.length; i++) {
        //   var dataItem = JSON.parse(dataArray[i]); // Parsing each data item as JSON
        //   console.log(dataItem.result); // Printing the 'result' property of each data item
        //   setMessages(prevMessages => {
        //     const updatedMessages = [...prevMessages];
        //     updatedMessages[updatedMessages.length - 1].text +=
        //       ' ' + dataItem.result;
        //     return updatedMessages;
        //   });
        // }

        await writeToJSON(updatedMessages);
      } catch (error) {
        console.error('Error making API call', error);
      }
    }
  };

  function getMaxStr(a, b) {
    console.log(`comparing ${a} and ${b}`);
    if (parseInt(a) > parseInt(b)) {
      console.log(`${a} is bigger`);
      return a;
    }
    console.log(`${b} is bigger`);
    return b;
  }

  const writeToJSON = async updatedMessages => {
    try {
      console.log(`going to write to conversations.json : `);
      console.log(updatedMessages);
      const jsonData = await RNFS.readFile(conversationsJSONpath, 'utf8');
      const data = JSON.parse(jsonData);

      var foundItem = null;
      for (var i = 0; i < data.length; i++) {
        item = data[i];
        console.log(item['phonenumber']);
        if (item['phonenumber'] === phoneNumber) {
          foundItem = item;
          break;
        }
      }

      var foundExistingChat = false;
      var maxID = -1;
      if (foundItem !== null) {
        foundItem['chats'].forEach(function (conversation) {
          if (conversation['id'] === curConvID) {
            conversation['conversations'] = updatedMessages;
            foundExistingChat = true;
          }
          maxID = getMaxStr(conversation['id'], maxID);
        });

        if (!foundExistingChat) {
          foundItem['chats'].push({
            id: String(parseInt(maxID) + 1),
            title: message.substring(0, 14),
            conversations: updatedMessages,
          });
        }
      } else {
        console.error('couldnt find phone number');
        data.push({
          phonenumber: phoneNumber,
          chats: [
            {
              id: '1',
              title: message.substring(0, 14),
              conversations: updatedMessages,
            },
          ],
        });
      }

      await RNFS.writeFile(conversationsJSONpath, JSON.stringify(data), 'utf8');

      console.log('uploading conversations.json to alicloud...');
      await AliyunOSS.asyncUpload(
        'safeplate',
        'conversations.json',
        conversationsJSONpath,
      )
        .then(e => {
          console.log(e);
        })
        .catch(e => {
          console.log(e);
        });

      await fetchData(false);
    } catch {
      console.log('failed bc cant find conv history with phone number');
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      console.log('here is the message: ');
      console.log(message);

      var entireUserPrompt = message;

      var languageDeterminant = '';
      var promptEngineering = '';
      if (messages.length === 0) {
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
        // 用户会问你提出三类问题中的一类

        entireUserPrompt = promptEngineering + languageDeterminant + message;
      }

      var updatedMessages = messages;
      updatedMessages.push({role: 'user', content: entireUserPrompt});
      updatedMessages.push({role: 'assistant', content: '...'});
      setMessages(updatedMessages);

      callAPI();

      setMessage('');
    }
  };

  const handleChatSelect = pchatID => {
    console.log('Selected chat:', pchatID);
    // Add your logic to handle chat selection
    var pchat;
    pastConversations.forEach(function (item) {
      if (item['id'] === pchatID) {
        setCurConvID(pchatID);
        pchat = item;
        return;
      }
    });

    setMessages(pchat['conversations']);
  };

  const handleNewChat = () => {
    setCurConvID(0);
    setMessages([]);
    console.log('new chat called');
  };

  const renderMessage = (msg, index) => {
    var isQuery = msg.role === 'user';
    const messageStyle = isQuery ? styles.queryMessage : styles.responseMessage;
    const containerStyle = isQuery
      ? styles.queryContainer
      : styles.responseContainer;
    const alignIcon = isQuery ? 'flex-end' : 'flex-start';

    if (isQuery) {
      return (
        <View key={index} style={[styles.chatMessageContainer, containerStyle]}>
          <View style={messageStyle}>
            <Text style={[globalstyles.outfit, styles.chatText]}>
              {msg.content}
            </Text>
          </View>
          {/* User icon container */}
          <View style={[styles.userIconContainer, {alignItems: alignIcon}]}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/name=${activeUser}&background=random`,
              }}
              style={styles.userIcon}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View key={index} style={[styles.chatMessageContainer, containerStyle]}>
          <View style={[styles.userIconContainer, {alignItems: alignIcon}]}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/name=AI&background=random`,
              }}
              style={styles.userIcon}
            />
          </View>
          <View style={messageStyle}>
            <Text style={[globalstyles.outfit, styles.chatText]}>
              {msg.content}
            </Text>
          </View>
        </View>
      );
    }
  };

  // return (
  //   <View style={{flex: 1}}>
  //     {/* Other components */}
  //     <ChatList chatNames={chatNames} handleChatSelect={handleChatSelect} />
  //     {/* Other components */}
  //   </View>
  // );

  const screenWidth = Dimensions.get('window').width;

  const bottomInterpolated = textInputBottom.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const scrollViewMaxHeight = textInputBottom.interpolate({
    inputRange: [0, 60],
    outputRange: ['60%', '0%'], // 55% minus textInputBottom's percentage
  });

  return (
    <View style={styles.container}>
      <View style={styles.chatBackground} />

      <View style={globalstyles.topMargin} />
      <View style={{paddingLeft: 10, paddingTop: 10}}>
        <BackButton />
      </View>
      <View style={styles.hstack}>
        <View style={globalstyles.marginLeft} />
        <View>
          <Text
            style={[
              {
                color: '#4c604a',
                paddingBottom: 10,
                paddingLeft: 10,
                paddingTop: 10,
              },
              globalstyles.outfit,
            ]}>
            {t('Health.previouschats')}
          </Text>
        </View>
      </View>

      {/* horizontal scroll for previous chats */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{width: 20}} />
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={5}
            style={{marginHorizontal: 10}}>
            <TouchableOpacity
              style={[
                {
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                styles.prevChatButton,
              ]}
              onPress={handleNewChat}>
              <Text style={{color: '#4c5445', fontSize: 16}}>New Chat</Text>
            </TouchableOpacity>
          </CardView>
          {pastConversations.map((pChat, index) => (
            <CardView
              key={index}
              cardElevation={4}
              cardMaxElevation={4}
              cornerRadius={5}
              style={{marginHorizontal: 10}}>
              <TouchableOpacity
                style={[
                  {
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  styles.prevChatButton,
                ]}
                onPress={() => handleChatSelect(pChat['id'])}>
                <Text style={{color: '#4c5445', fontSize: 16}}>
                  {pChat['title'].length > 10
                    ? pChat['title'].substring(0, 7) + '...'
                    : pChat['title']}
                </Text>
              </TouchableOpacity>
            </CardView>
          ))}
        </ScrollView>
      </View>

      <View style={{height: '1%'}} />

      {/* health title */}
      <View style={styles.hstack}>
        <View style={globalstyles.marginLeft} />
        <View>
          <Text
            style={[
              globalstyles.headerTitle,
              globalstyles.outfit,
              {
                color: '#4c604a',
                fontWeight: '600',
                fontSize: 40,
                paddingLeft: 10,
              },
            ]}>
            {t('Health.title')}
          </Text>

          {/* for keyboard avoidance debugging 😭 */}
          {/* <Text>
            The keyboard is {isKeyboardVisible ? 'visible' : 'hidden'}
          </Text> */}
        </View>
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={[
          styles.chatContainer,
          {maxHeight: scrollViewMaxHeight, marginTop: '5%'},
        ]}
        // style={[styles.chatContainer, {maxHeight: '55%'}]}
        contentContainerStyle={styles.chatContentContainer}
        showsVerticalScrollIndicator={true}
        inverted // Reverse the order of messages
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }>
        {messages.map((msg, index) => {
          let replacedMsg = msg.content;
          regexRemoves.forEach(replaceStr => {
            replacedMsg = replacedMsg.replace(replaceStr, '');
          });
          return renderMessage({role: msg.role, content: replacedMsg}, index);
        })}
      </Animated.ScrollView>

      <View style={{height: '1%'}} />

      <Animated.View
        style={[
          styles.inputContainer,
          {
            bottom: bottomInterpolated,
          },
        ]}>
        <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
          <TextInput
            style={[styles.input, globalstyles.outfit]}
            value={message}
            onChangeText={setMessage}
            placeholder={t('Health.questionprompt')}
            multiline={true}
            textAlignHorizontal="center"
            placeholderTextColor="#555555"
          />
        </CardView>
        <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
          <TouchableOpacity
            onPress={handleSendMessage}
            style={[styles.sendButton, {backgroundColor: '#fb904d'}]}>
            <Svg
              version="1.1"
              width="20"
              height="20"
              x="0"
              y="0"
              viewBox="0 0 512 512"
              style="enable-background:new 0 0 512 512"
              class="">
              <G>
                <Path
                  d="M473.9 18.67C327.62 64.31 171.56 126.71 14.6 184.6c-19.59 7.24-19.44 33.74.3 39.54 45.61 13.39 91.4 27.43 137.2 41.66 2.97.92 6.19.51 8.81-1.13 73.22-45.83 147.01-92.91 218.62-137.43 3.71-2.31 7.75 2.91 4.53 5.86-58.18 53.4-118.67 108.94-178.26 163.61-3.82 3.5-4.51 9.26-1.65 13.61 38.39 58.39 76.65 117.07 112.47 174.71 9.1 14.68 30.63 11.61 37.11-5.09 56.01-145.05 114.99-288.64 157.16-424.4 6.42-20.82-16.2-43.31-36.99-36.87z"
                  fill="#ffffff"
                  opacity="1"
                  data-original="#000000"
                  class=""></Path>
                <Path
                  d="M145 310.97c.36 40.59 1.1 81.18 2.21 121.77.52 17.34 20.96 26.97 33.24 15.42 12.84-12.04 25.83-24.19 38.94-36.41 6.34-5.91 7.5-15.7 2.69-23.1-18.24-28.06-36.69-56.13-55.1-84.06-6.58-9.98-22.08-5.46-21.97 6.38z"
                  fill="#ffffff"
                  opacity="1"
                  data-original="#000000"
                  class=""></Path>
              </G>
            </Svg>
          </TouchableOpacity>
        </CardView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  queryMessage: {
    backgroundColor: '#d8d8d8',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    maxWidth: '70%',
  },

  responseMessage: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginLeft: 10,
    maxWidth: '70%',
  },
  queryContainer: {
    justifyContent: 'flex-end',
  },

  responseContainer: {
    justifyContent: 'flex-start',
  },
  chatBackground: {
    position: 'absolute',
    backgroundColor: '#a7d7c0',
    width: '100%',
    height: '70%',
    left: 0,
    bottom: 0,
    zIndex: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  prevChatButton: {
    backgroundColor: 'white', // Adjust colors accordingly
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    minWidth: 120,
  },
  hstack: {
    // position: 'absolute',
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items vertically
    // justifyContent: 'space-between', // Align items with equal space between them
    marginLeft: '5%', // Add left margin to create space from the left edge of the screen
    marginRight: '7%', // Add right margin to create space from the right edge of the screen
  },
  chatContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  userIconContainer: {
    alignItems: 'flex-start', // Align the user icon to the start (top) of the container
  },
  chatText: {
    flexWrap: 'wrap', // Allow text to wrap within its container
    fontSize: 15,
  },
  chatContainer: {
    flex: 1,
    marginHorizontal: '1%',
  },
  chatMessageContainer: {
    flexDirection: 'row', // Align text and icon horizontally
    // alignItems: 'center', // Align items vertically
    justifyContent: 'flex-end', // Align items to the end of the container (right)
    marginBottom: 10, // Add margin between chat messages
  },
  chatMessage: {
    backgroundColor: '#d8d8d8',
    borderRadius: 12,
    padding: 15,
    marginRight: 10, // Add margin between message and user icon
    maxWidth: '70%', // Limit the width of the message bubble to 70% of the container
  },
  userIcon: {
    width: 40, // Specify the width
    height: 40, // Specify the height
    resizeMode: 'contain', // Keep the icon aspect ratio
    borderRadius: 100,
  },
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#f9fff4',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    // Additional header styling
  },
  chatHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    // Additional chat header styling
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    paddingBottom: '5%',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure space distribution between child components
    position: 'absolute',
    left: '3%',
    right: '3%',
  },
  input: {
    flex: 1, // Allow TextInput to expand and fill available space
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: '5%',
    minWidth: '85%',
    maxWidth: '85%',
    // marginRight: 10, // Add right margin for spacing between TextInput and Send button
    justifyContent: 'center',
    color: '#555555',
  },
  sendButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

const mapDispatchToProps = {
  setPhoneNumber,
  setActiveUser,
};

const mapStateToProps = state => ({
  phoneNumber: state.phoneNumber,
  activeUser: state.activeUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
