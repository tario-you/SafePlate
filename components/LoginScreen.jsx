import AliyunOSS from 'aliyun-oss-react-native';
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import Svg, {Path, Rect} from 'react-native-svg';
// assets/imgs/orange-orange.svg
import {useTranslation} from 'react-i18next';
import OrangeOrange from '../assets/imgs/orange-orange.svg';
import YellowOrange from '../assets/imgs/orange-yellow.svg';
import BackButton from './BackButton';
const globalstyles = require('./GlobalStyles');
var RNFS = require('react-native-fs');

import {connect} from 'react-redux';
import {setActiveUser, setPhoneNumber} from './actions';

const bcrypt = require('bcrypt');

const LoginScreen = ({
  navigation,
  phoneNumber,
  activeUser,
  setPhoneNumber,
  setActiveUser,
}) => {
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [problems, setProblems] = useState([]);

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const correctLoginInfo = async (email, password) => {
    AliyunOSS.asyncDownload('safeplate', 'users.json')
      .then(e => {
        console.log('successfully downloaded from users.json');
        console.log(e);
      })
      .catch(e => {
        console.log('failed to download from users.json');
        console.log(e);
      });

    const jsonData = await RNFS.readFile(
      RNFS.DocumentDirectoryPath + '/users.json',
      'utf8',
    );

    const data = JSON.parse(jsonData);
    console.log('fetched community data MEOW:');
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      if (email === data[i].phonenumber) {
        const enteredPassword = password;
        const storedHash = data[i].password;

        const result = await bcrypt.compare(enteredPassword, storedHash);

        if (result) {
          return 'true';
        } else {
          return 'false';
        }
      }
    }

    return '*username not found';
  };

  const handleLogin = async () => {
    console.log('Login with:', email);

    var loginCorrect = await correctLoginInfo(email, password);

    var preExistingProblems = [...problems];
    var errorMessages = [
      '*username cannot be empty',
      '*password cannot be empty',
      '*username not found',
      `*password doesn't match our records`,
    ];
    var errorBooleans = [
      email === '',
      password === '',
      loginCorrect === '*username not found' ? true : false,
      loginCorrect === 'false' ? true : false,
    ];

    for (var i = 0; i < errorMessages.length; i++) {
      var eMsg = errorMessages[i];
      var eBool = errorBooleans[i];
      if (problems.findIndex(item => item === eMsg) === -1 && eBool) {
        preExistingProblems.push(eMsg);
      } else if (problems.findIndex(item => item === eMsg) !== -1 && !eBool) {
        preExistingProblems = removeItemOnce(preExistingProblems, eMsg);
      }
    }

    setProblems(preExistingProblems);

    if (preExistingProblems.length === 0) {
      console.log('there are no problems, proceeding to login to user');

      setPhoneNumber(email);

      AliyunOSS.asyncDownload('safeplate', 'users.json')
        .then(e => {
          console.log('successfully downloaded from users.json');
          console.log(e);
        })
        .catch(e => {
          console.log('failed to download from users.json');
          console.log(e);
        });

      const jsonData = await RNFS.readFile(
        RNFS.DocumentDirectoryPath + '/users.json',
        'utf8',
      );

      var data = JSON.parse(jsonData);
      for (var i = 0; i < data.length; i++) {
        const user = data[i];
        if (user.phonenumber === email) {
          setActiveUser(user.members[0].username);
        }
      }
      navigation.navigate('Home');
    }

    return;
    navigation.navigate('Home');
    navigation.navigate('Verify', {email});
  };

  const handleSocialLogin = service => {
    console.log(`Login with ${service}`);
    // Бекэнд нахуй
  };

  return (
    <View style={[styles.container]}>
      <OrangeOrange
        width={'50%'}
        height={'20%'}
        style={[globalstyles.fruitIcon, {right: '5%', top: '5%'}]}
      />
      <YellowOrange
        width={'50%'}
        height={'20%'}
        style={[globalstyles.fruitIcon, {bottom: '5%', left: '5%'}]}
      />
      <View style={globalstyles.topMargin} />
      <BackButton />
      {/* <View style={globalstyles.topMargin} /> */}
      <View style={globalstyles.verticallyCentered}>
        <View style={globalstyles.hstack}>
          <View style={globalstyles.marginLeft} />
          <View>
            <Text
              style={[
                globalstyles.headerTitle,
                globalstyles.outfit,
                {color: '#454f3f', fontWeight: '600', fontSize: 40},
              ]}>
              {t('HomeScreen.Log In')}
            </Text>
            {/* <Text style={[{color: '#454f3f'}, globalstyles.outfit]}>
              {t('Login.descript')}
            </Text> */}
            <View style={globalstyles.betweenPadding} />

            {problems.length !== 0 && (
              <View>
                <Text
                  style={[
                    {color: '#ff7070', marginTop: '2%'},
                    globalstyles.outfit,
                  ]}>
                  {problems.join('\n')}
                </Text>
              </View>
            )}

            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TextInput
                placeholderTextColor="#555555"
                placeholder={t('Settings.Username')}
                value={email}
                onChangeText={setEmail}
                style={[styles.input, {color: '#555555'}, globalstyles.outfit]}
              />
            </CardView>
            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TextInput
                placeholderTextColor="#555555"
                placeholder={t('Login.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry // This secures the password field
                style={[styles.input, globalstyles.outfit]}
              />
            </CardView>

            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TouchableOpacity
                style={[styles.continueButton, styles.margin]}
                onPress={handleLogin}>
                <View style={globalstyles.hstack}>
                  <Text style={[{color: '#6e8461'}, globalstyles.outfit]}>
                    {t('Login.continue')}{' '}
                  </Text>
                  <Svg
                    fill="#454f3f"
                    height="13px"
                    width="20px"
                    viewBox="0 0 330 330">
                    <Path
                      id="XMLID_222_"
                      d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
	c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
	C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
	C255,161.018,253.42,157.202,250.606,154.389z"
                    />
                  </Svg>
                </View>
              </TouchableOpacity>
            </CardView>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center', // Add this line to center the content horizontally
                  marginTop: '5%',
                }}>
                <Text style={[styles.underline, globalstyles.outfit]}>
                  Don't have an account? Sign up
                </Text>
                <View>
                  <Svg
                    fill="#454f3f"
                    height="13px"
                    width="20px"
                    viewBox="0 0 330 330">
                    <Path
                      id="XMLID_222_"
                      d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
	c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
	C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
	C255,161.018,253.42,157.202,250.606,154.389z"
                    />
                  </Svg>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={globalstyles.marginRight} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: 'underline',
  },
  socialText: {
    position: 'absolute',
    alignSelf: 'center',
    left: '16%',
    fontWeight: 'bold',
  },
  socialIconContainer: {
    flexDirection: 'row',
    position: 'relative', // To allow absolute positioning of children
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
    resizeMode: 'contain',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafff5',
  },
  backButton: {
    width: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    // Add more styling
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 9,
    paddingLeft: 15,
    borderRadius: 12,
    // Add more styling
  },
  continueButton: {
    backgroundColor: 'white', // Adjust colors accordingly
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    // Add more styling
  },
  socialButton: {
    // Style your social buttons
    paddingVertical: 2,
    marginVertical: 5,
    borderRadius: 5,
  },
  margin: {
    marginLeft: '60%',
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
