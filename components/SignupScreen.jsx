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

const bcrypt = require('bcrypt');
const saltRounds = 10;

import {connect} from 'react-redux';
import {setActiveUser, setPhoneNumber} from './actions';

const SignupScreen = ({
  navigation,
  phoneNumber,
  activeUser,
  setPhoneNumber,
  setActiveUser,
}) => {
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [problems, setProblems] = useState([]);

  const endpoint = 'oss-cn-beijing.aliyuncs.com';
  const accessKeyId = 'LTAI5tDmcm8oGXEUzErYN4Dz';
  const accessKeySecret = '5FxhJIoSojAXH10IHk6UJ3nWp3PwQT';

  const configuration = {
    maxRetryCount: 3,
    timeoutIntervalForRequest: 30,
    timeoutIntervalForResource: 24 * 60 * 60,
  };

  AliyunOSS.initWithPlainTextAccessKey(
    accessKeyId,
    accessKeySecret,
    endpoint,
    configuration,
  );

  async function hashPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (err) {
      console.error(err);
      throw new Error('Error hashing password');
    }
  }

  const addUser = async newUser => {
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
    console.log('fetched community data MEOW:');
    console.log(data);

    data.push(newUser);

    RNFS.writeFile(
      RNFS.DocumentDirectoryPath + '/users.json',
      JSON.stringify(data),
      'utf8',
    )
      .then(e => {
        console.log('wrote file');
      })
      .catch(e => {
        console.log('failed to write file');
      });

    AliyunOSS.asyncUpload(
      'safeplate',
      'users.json',
      RNFS.DocumentDirectoryPath + '/users.json',
    )
      .then(e => {
        console.log('uploaded');
      })
      .catch(e => {
        console.log('couldnt upload');
      });

    setPhoneNumber(newUser.phonenumber);

    navigation.navigate('Home');
  };

  const checkIfUsernameInJSON = async check => {
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
      if (check === data[i].phonenumber) {
        console.log('found username already', check);
        return true;
      }
    }

    console.log('USERNAME NOT FOUND !!', check);
    return false;
  };

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const handleLogin = async () => {
    console.log('Login with:', email);

    var preExistingProblems = [...problems];
    var errorMessages = [
      '*username cannot be empty',
      '*password has to be at least 8 characters',
      '*username already exists',
      `*password and re-entered password don't match`,
    ];
    var errorBooleans = [
      email === '',
      password.length < 8 || reenterPassword.length < 8,
      await checkIfUsernameInJSON(email),
      password !== reenterPassword,
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
      console.log('there are no problems, proceeding to upload new user');

      var newUser = {
        phonenumber: email,
        password: password,
        members: [],
      };

      addUser(newUser);
    }
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
      <View style={globalstyles.verticallyCentered}>
        <View style={globalstyles.hstack}>
          <View style={globalstyles.marginLeft} />
          <View>
            {/* title */}
            <Text
              style={[
                globalstyles.headerTitle,
                globalstyles.outfit,
                {color: '#454f3f', fontWeight: '600', fontSize: 40},
              ]}>
              {t('HomeScreen.Sign Up')}
            </Text>

            {/* descript */}
            <Text style={[{color: '#454f3f'}, globalstyles.outfit]}>
              Create your account
            </Text>

            {/* problems */}
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
            <View style={globalstyles.betweenPadding} />

            {/* username */}
            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TextInput
                placeholderTextColor="#555555"
                placeholder={t('Settings.Username')}
                value={email}
                onChangeText={setEmail}
                style={[styles.input, {color: '#555555'}, globalstyles.outfit]}
              />
            </CardView>

            {/* password */}
            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TextInput
                placeholderTextColor="#555555"
                placeholder={t('Login.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.input, globalstyles.outfit]}
                blurOnSubmit={false}
                textContentType="oneTimeCode"
              />
            </CardView>

            {/* re-enter password */}
            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TextInput
                placeholderTextColor="#555555"
                placeholder={t('Login.reenter_password')}
                value={reenterPassword}
                onChangeText={setReenterPassword}
                secureTextEntry
                style={[styles.input, globalstyles.outfit]}
                blurOnSubmit={false}
                textContentType="oneTimeCode"
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
          </View>
          <View style={(globalstyles.marginRight, globalstyles.outfit)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
