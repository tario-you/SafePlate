import {useNavigation} from '@react-navigation/native';
import i18next, {t} from 'i18next';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import Svg, {Circle, ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
var RNFS = require('react-native-fs');
const globalstyles = require('./GlobalStyles');

import {connect} from 'react-redux';
import {setActiveUser, setPhoneNumber} from './actions';

// import {useFocusEffect} from '@react-navigation/core';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = ({
  phoneNumber,
  activeUser,
  setPhoneNumber,
  setActiveUser,
}) => {
  const navigation = useNavigation();

  const familyJSONpath = RNFS.DocumentDirectoryPath + '/users.json';

  const [username, setUsername] = useState('');
  const [weight, setWeight] = useState(0);
  const [weightUnits, setWeightUnits] = useState('');
  const [heightMeter, setHeightMeter] = useState(0);
  const [heightFeet, setHeightFeet] = useState(0);
  const [heightInch, setHeightInch] = useState(0);
  const [heightUnits, setHeightUnits] = useState('');
  const [age, setAge] = useState(0);
  const [allergies, setAllergies] = useState('');
  const [sex, setSex] = useState('');
  const [healthConditions, setHealthConditions] = useState('');

  const [isSexDropdownVisible, setSexDropdownVisible] = useState(false);
  const [isHeightUnitsDropdownVisible, setHeightUnitsDropdownVisible] =
    useState(false);
  const [isWeightUnitsDropdownVisible, setWeightUnitsDropdownVisible] =
    useState(false);

  const [checkedIfUserAlreadyFilled, setIfUserAlreadyFilled] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const sexOptions = ['Male', 'Female'];
  const heightUnitOptions = ['Meters (m)', 'Feet (ft)'];
  const weightUnitOptions = ['Pounds (lb)', 'Kilograms (kg)'];

  const [userData, setUserData] = useState([]);
  const [userFound, setUserFound] = useState(false);

  const isFocused = useIsFocused();

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

  const readFromJSON = async () => {
    try {
      // read from alicloud/users.json
      AliyunOSS.asyncDownload('safeplate', 'users.json')
        .then(async e => {
          console.log('successfully downloaded users.json from alicloud...');
          // console.log(e);
          // const jsonData = await RNFS.readFile(familyJSONpath, 'utf8');
          // console.log('jsonData:', jsonData);
          // const data = JSON.parse(jsonData);
          // setUserData(data);
          // console.log('parsed json data:', data);
        })
        .catch(e => {
          console.log('failed to downloaded users.json from alicloud...');
          console.log(e);
        });
      const jsonData = await RNFS.readFile(familyJSONpath, 'utf8');
      console.log('jsonData:', jsonData);
      const data = JSON.parse(jsonData);
      console.log('parsed json data:', data);
      return data;
    } catch (error) {
      console.error('Error reading data from family.json:', error);
    }
  };

  const fetchData = async () => {
    setUserFound(false);
    console.log(`userfound = ${userFound}`);

    const data = await readFromJSON();

    var hasMembers = false;

    console.log('read');
    for (var i = 0; i < data.length; i++) {
      const user = data[i];
      console.log('viewing: ');
      console.log(user);
      if (user.phonenumber === phoneNumber) {
        console.log('found!');
        console.log(user);
        if (user.members && user.members.length > 0) {
          hasMembers = true;
          setUserData(user.members);
          setUserFound(true);
          setShowOverlay(false);
          console.log('set to false here 1');
          setIfUserAlreadyFilled(true);
        } else {
          setShowOverlay(true);
          setIfUserAlreadyFilled(false);
        }
        setActiveUser(user.members[0].username);
        break;
      } else {
        setShowOverlay(true);
        setUserFound(false);
        // console.log(`userfound = ${userFound}`);
      }
    }
    console.log(`userfound = ${userFound}`);
    if (hasMembers) {
      setIfUserAlreadyFilled(true);
    }
  };

  useEffect(() => {
    console.log(RNFS.DocumentDirectoryPath);
    for (var i = 0; i < 2; i++) {
      setTimeout(() => {
        setIfUserAlreadyFilled(false);
        setUserFound(prevUserFound => false);
        console.log(`userfound = ${userFound}`);
        console.log(`phone number = ${phoneNumber}`);
        if (phoneNumber === null && activeUser === null) {
          // setPhoneNumber('1');
          handleLoginPress();
        } else {
          fetchData();
        }
        setTimeout(() => {
          setIfUserAlreadyFilled(false);
          setUserFound(prevUserFound => false);
          console.log(`userfound = ${userFound}`);
          console.log(`phone number = ${phoneNumber}`);
          if (phoneNumber === null && activeUser === null) {
            // setPhoneNumber('1');
            handleLoginPress();
          } else {
            fetchData();
          }
        }, 1000);
      }, 1000);
    }
  }, [isFocused]);

  const handlePersonalInfoContinue = () => {
    if (
      username !== '' &&
      weight !== 0 &&
      (heightMeter !== 0 || (heightFeet !== 0 && heightInch !== 0)) &&
      age !== 0 &&
      sex !== ''
    ) {
      console.log('can continue');
      setShowOverlay(false);
      console.log('set to false here 2');
      writeToFamilyJSON();
    } else {
      console.log('cannt!!');
      const data = [
        {
          phonenumber: phoneNumber,
          params: {
            username: username,
            weight: weight,
            weightUnits: weightUnits,
            heightMeter: heightMeter,
            heightFeet: heightFeet,
            heightInch: heightInch,
            heightUnits: heightUnits,
            age: age,
            allergies: allergies,
            sex: sex,
            healthConditions: healthConditions,
          },
        },
      ];
      console.log(data);
    }
  };

  const writeToFamilyJSON = async () => {
    const editedUser = {
      username: username,
      weight: weight,
      weightUnits: weightUnits,
      heightMeter: heightMeter,
      heightFeet: heightFeet,
      heightInch: heightInch,
      heightUnits: heightUnits,
      age: age,
      allergies: allergies,
      sex: sex,
      healthConditions: healthConditions,
    };

    // get the element in alldata that has its element.phonenumber === phoneNumber
    // if inside that element there's an user with user.username == username,
    // update that user's with the new editeduser
    // write the edited entire alldata back to the json file

    // else, add editeduser to that element (effectively appending that user)
    // write the edited entire alldata back to the json file

    // use this function to write to the json file
    // try {
    //   RNFS.writeFile(familyJSONpath, JSON.stringify(data), 'utf8');
    //   console.log('Data written to family.json successfully!');
    // } catch (error) {
    //   console.error('Error writing data to family.json:', error);
    // }
    try {
      // Read data from JSON file
      const allData = await readFromJSON();
      // console.log(allData);

      // Find the element in allData that matches the conditions
      const matchingElement = allData.find(
        element => element.phonenumber === phoneNumber,
      );

      if (matchingElement) {
        // Check if the user exists in the matching element
        console.log(`activeUser = ${activeUser}`);
        var existingUserIndex = -1;
        for (var i = 0; i < matchingElement.members.length; i++) {
          if (matchingElement.members[i].username === activeUser) {
            existingUserIndex = i;
            break;
          }
        }

        console.log(`existingUserIndex = ${existingUserIndex}`);

        if (existingUserIndex !== -1) {
          // If user exists, update user's data
          console.log("updating user's data");
          matchingElement.members[existingUserIndex] = editedUser;
        } else {
          // If user doesn't exist, append user to the matching element
          console.log('creating user data');
          console.log(typeof matchingElement);
          console.log(matchingElement.members);
          matchingElement.members.push(editedUser);
        }
        setActiveUser(editedUser.username);
      } else {
        // If matching element not found, create a new element and add editedUser
        // allData.push({
        //   phonenumber: phoneNumber,
        //   users: [editedUser],
        // });
        console.error(`no user found for phone number ${phoneNumber}`);
      }

      // Write the updated data back to the JSON file
      await RNFS.writeFile(familyJSONpath, JSON.stringify(allData), 'utf8');
      console.log('Data written to family.json successfully!');

      // upload local users.json to alicloud/users.json
      console.log('uploading users.json to alicloud...');
      await AliyunOSS.asyncUpload('safeplate', 'users.json', familyJSONpath)
        .then(e => {
          console.log(e);
        })
        .catch(e => {
          console.log(e);
        });
      await fetchData(false);
    } catch (error) {
      console.error('Error writing data to family.json:', error);
    }
  };

  const handleSexPress = index => {
    setSexDropdownVisible(false);
    setSex(sexOptions[index]);
  };

  const handleHeightUnitsPress = index => {
    setHeightUnitsDropdownVisible(false);
    setHeightUnits(heightUnitOptions[index]);
    console.log(heightUnits);
  };

  const handleWeightUnitsPress = index => {
    setWeightUnitsDropdownVisible(false);
    setWeightUnits(weightUnitOptions[index]);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleFeatureSelect = feature => {
    if (feature === 'Health') {
      navigation.navigate('ChatBot');
    } else if (feature === 'Community') {
      navigation.navigate('Community');
    } else if (feature === 'Scan') {
      navigation.navigate('Camera');
    } else {
      navigation.navigate('UnderDevelopment');
    }
  };

  return (
    <View style={styles.bgcontainer}>
      <View style={{height: '5%'}} />

      {/* top bar + title */}
      <View style={[styles.hstack]}>
        <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
          <TouchableOpacity
            onPress={handleSettingsPress}
            style={styles.iconButton}>
            <Svg
              width="40"
              height="40"
              viewBox="0 0 682.667 682.667"
              style="enable-background:new 0 0 512 512"
              class="">
              <G>
                <Defs>
                  <ClipPath id="a" clipPathUnits="userSpaceOnUse">
                    <Path
                      d="M0 512h512V0H0Z"
                      fill="#000000"
                      opacity="1"
                      data-original="#000000"></Path>
                  </ClipPath>
                </Defs>
                <G
                  clip-path="url(#a)"
                  transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                  <Path
                    d="M0 0c-43.446 0-78.667-35.22-78.667-78.667 0-43.446 35.221-78.666 78.667-78.666 43.446 0 78.667 35.22 78.667 78.666C78.667-35.22 43.446 0 0 0Zm220.802-22.53-21.299-17.534c-24.296-20.001-24.296-57.204 0-77.205l21.299-17.534c7.548-6.214 9.497-16.974 4.609-25.441l-42.057-72.845c-4.889-8.467-15.182-12.159-24.337-8.729l-25.835 9.678c-29.469 11.04-61.688-7.561-66.862-38.602l-4.535-27.213c-1.607-9.643-9.951-16.712-19.727-16.712h-84.116c-9.776 0-18.12 7.069-19.727 16.712l-4.536 27.213c-5.173 31.041-37.392 49.642-66.861 38.602l-25.834-9.678c-9.156-3.43-19.449.262-24.338 8.729l-42.057 72.845c-4.888 8.467-2.939 19.227 4.609 25.441l21.3 17.534c24.295 20.001 24.295 57.204 0 77.205l-21.3 17.534c-7.548 6.214-9.497 16.974-4.609 25.441l42.057 72.845c4.889 8.467 15.182 12.159 24.338 8.729l25.834-9.678c29.469-11.04 61.688 7.561 66.861 38.602l4.536 27.213c1.607 9.643 9.951 16.711 19.727 16.711h84.116c9.776 0 18.12-7.068 19.727-16.711l4.535-27.213c5.174-31.041 37.393-49.642 66.862-38.602l25.835 9.678c9.155 3.43 19.448-.262 24.337-8.729l42.057-72.845c4.888-8.467 2.939-19.227-4.609-25.441z"
                    style="stroke-width:100;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1"
                    transform="translate(256 334.666)"
                    fill="#496149"
                    stroke="#496149"
                    stroke-width="100"
                    class=""></Path>
                </G>
              </G>
            </Svg>
          </TouchableOpacity>
        </CardView>

        <CardView
          cardElevation={4}
          cardMaxElevation={4}
          cornerRadius={5}
          style={{zIndex: 3}}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              {
                zIndex: 3,
                height: '13px',
                backgroundColor: phoneNumber === null ? '#496149' : '#f0aba8',
              },
            ]}
            onPress={handleLoginPress}>
            {phoneNumber === null ? (
              <View style={styles.hstack}>
                <Text style={[{color: '#ffffff'}, globalstyles.outfit]}>
                  {t('HomeScreen.Log In')} / {t('HomeScreen.Sign Up')}
                </Text>
              </View>
            ) : (
              <View style={styles.hstack}>
                <Text style={[{color: '#000000'}, globalstyles.outfit]}>
                  {t('HomeScreen.Log Out')}
                </Text>
                <Svg
                  fill="#000000"
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
            )}
          </TouchableOpacity>
        </CardView>
      </View>

      {/* features */}
      <View style={styles.verticallyCentered}>
        {/* welcome */}
        <View style={styles.hstackflex}>
          <View>
            <Text
              style={[
                styles.welcomeMessage,
                globalstyles.outfit,
                {
                  color: '#496149',
                  fontWeight: '600',
                  fontSize: 40,
                  textAlign: 'left',
                },
              ]}>
              {t('HomeScreen.Hello')}, {activeUser}!
            </Text>
            <Text style={[globalstyles.outfit, {color: '#496149'}]}>
              {t('HomeScreen.Welcome to')} Safeplate
            </Text>
          </View>
        </View>

        {/* modules */}
        <View style={[styles.hstack, {marginRight: '-6%'}]}>
          <View style={globalstyles.marginLeft} />
          <View style={{width: '100%'}}>
            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TouchableOpacity
                onPress={() => handleFeatureSelect('Scan')}
                style={[styles.featureButton, {backgroundColor: '#def7ff'}]}>
                <Svg
                  version="1.1"
                  width="44"
                  height="44"
                  x="0"
                  y="0"
                  viewBox="0 0 32 32"
                  style="enable-background:new 0 0 512 512"
                  class="">
                  <G>
                    <Path
                      d="M27.348 7h-4.294l-.5-1.5A3.645 3.645 0 0 0 19.089 3h-6.178a3.646 3.646 0 0 0-3.464 2.5L8.946 7H4.652A3.656 3.656 0 0 0 1 10.652v14.7A3.656 3.656 0 0 0 4.652 29h22.7A3.656 3.656 0 0 0 31 25.348v-14.7A3.656 3.656 0 0 0 27.348 7ZM29 25.348A1.654 1.654 0 0 1 27.348 27H4.652A1.654 1.654 0 0 1 3 25.348v-14.7A1.654 1.654 0 0 1 4.652 9h5.015a1 1 0 0 0 .948-.684l.729-2.187A1.65 1.65 0 0 1 12.911 5h6.178a1.649 1.649 0 0 1 1.567 1.13l.729 2.186a1 1 0 0 0 .948.684h5.015A1.654 1.654 0 0 1 29 10.652Z"
                      fill="#a8c5dc"
                      opacity="1"
                      data-original="#000000"></Path>
                    <Path
                      d="M16 10a7.5 7.5 0 1 0 7.5 7.5A7.508 7.508 0 0 0 16 10Zm0 13a5.5 5.5 0 1 1 5.5-5.5A5.506 5.506 0 0 1 16 23Z"
                      fill="#a8c5dc"
                      opacity="1"
                      data-original="#000000"></Path>
                    <Circle
                      cx="26"
                      cy="12"
                      r="1"
                      fill="#a8c5dc"
                      opacity="1"
                      data-original="#000000"></Circle>
                  </G>
                </Svg>
                <View style={{width: '2.4%'}} />
                <View style={styles.textContainer}>
                  <Text style={[styles.featureTitle, globalstyles.outfit]}>
                    {t('HomeScreen.Scan')}
                  </Text>
                  <Text
                    style={[
                      styles.featureSubtitle,
                      globalstyles.outfit,
                      {color: '#5173a1'},
                    ]}>
                    {t('HomeScreen.Scan descript')}
                  </Text>
                </View>
              </TouchableOpacity>
            </CardView>

            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TouchableOpacity
                onPress={() => handleFeatureSelect('Community')}
                style={[styles.featureButton, {backgroundColor: '#eefdd8'}]}>
                <Svg
                  version="1.1"
                  width="44"
                  height="44"
                  x="0"
                  y="0"
                  viewBox="0 0 512 512"
                  style="enable-background:new 0 0 512 512"
                  class="">
                  <G>
                    <Path
                      d="M387.664 464.017c-2.77-4.774-8.887-6.4-13.667-3.63l-.385.222c-4.776 2.771-6.401 8.89-3.631 13.667a9.996 9.996 0 0 0 13.667 3.63l.385-.222c4.776-2.771 6.401-8.89 3.631-13.667z"
                      fill="#b2c59a"
                      opacity="1"
                      data-original="#000000"
                      class=""></Path>
                    <Path
                      d="M477.694 128.08C443.512 68.875 388.321 26.526 322.287 8.832 256.255-8.862 187.283.219 128.078 34.4 68.874 68.581 26.524 123.773 8.831 189.806-8.862 255.839.218 324.812 34.399 384.016c30.661 53.107 79.393 93.468 137.219 113.646a256.812 256.812 0 0 0 84.597 14.337c31.065 0 62.074-5.646 91.385-16.911 5.155-1.981 7.727-7.766 5.745-12.921s-7.768-7.73-12.921-5.745c-78.02 29.987-162.482 16.362-225.585-31.004l8.959-46.765 4.317-1.402c16.313-5.3 25.273-22.884 19.975-39.198l-3.168-9.749a11.042 11.042 0 0 1 .01-6.895 31.12 31.12 0 0 0-2.725-25.433 31.127 31.127 0 0 0-20.867-14.795l-22.57-4.41-43.548-33.11a10 10 0 0 0-9.142-1.551l-25.496 8.282a235.743 235.743 0 0 1-.035-27.303 57.936 57.936 0 0 1 2.064 1.992 10.044 10.044 0 0 0 1.841 2.253c2.082 1.896 3.968 2.756 7.928 2.756 3.639-.001 9.026-.726 17.921-2.04a1018.28 1018.28 0 0 0 16.911-2.666 10 10 0 0 0 6.608-15.493l-12.261-17.984 17.562-12.558a10.007 10.007 0 0 0 2.861-3.164l27.223-47.525 10.973-11.758c11.213-12.018 14.413-29.601 8.151-44.797-3.694-8.963-10.146-16.425-18.216-21.454a236.657 236.657 0 0 1 27.963-18.932c36.338-20.98 75.994-31.147 115.233-31.536l-17.856 22.399-66.215 23.213a9.995 9.995 0 0 0-5.935 5.622l-18.492 44.828a10 10 0 0 0 1.105 9.623l27.008 37.832c-3.868 3.529-7.633 8.669-12.13 15.051-1.972 2.799-3.834 5.442-5.121 6.924a406.453 406.453 0 0 1-3.349 3.798c-5.809 6.535-11.815 13.294-16.082 22.322-9.382 19.859-7.487 42.941 4.945 60.239 12.021 16.725 31.839 25.227 52.991 22.739 3.446-.404 6.659-1.199 9.768-1.969 8.573-2.121 11.289-2.333 14.039.241 1.338 1.253 1.461 1.49 1.434 5.739-.019 2.704-.04 6.068.892 9.909 1.493 6.145 5.352 10.392 8.452 13.804 1.541 1.695 3.135 3.449 3.626 4.626 3.119 7.474 1.761 11.613-1.215 20.683a382.87 382.87 0 0 0-.776 2.38c-4.521 13.995 1.781 27.877 7.341 40.123 1.806 3.977 3.511 7.731 4.628 11.049 8.991 26.679 15.731 32.789 21.14 35.249 2.833 1.288 5.765 1.853 8.727 1.852 14.415-.001 29.457-13.385 36.367-21.87 4.34-5.328 5.409-10.663 6.189-14.56.389-1.938.695-3.468 1.279-4.468.894-1.53 1.947-2.716 3.28-4.218 2.681-3.019 6.018-6.775 8.179-13.584 1.642-5.172 2.835-6.44 6.786-10.648a272.63 272.63 0 0 0 2.208-2.369c13.319-14.493 9.889-25.564 6.256-37.286-3.057-9.863 2.29-16.171 15.218-28.21 5.604-5.219 11.398-10.615 15.877-17.099 1.96-2.838 7.923-11.471 4.233-20.028-3.617-8.39-12.81-9.8-20.196-10.932-2.917-.448-7.325-1.124-8.728-2.041-6.187-4.045-9.972-12.487-13.633-20.652-.729-1.625-1.448-3.229-2.177-4.786-1.3-2.778-2.599-6.139-3.974-9.697-3.638-9.416-7.761-20.089-14.78-27.529-6.309-6.685-18.202-9.905-28.695-12.747-3.529-.955-6.86-1.857-9.057-2.668a9.986 9.986 0 0 0-5.745-.355c-5.107 1.197-8.293 2.516-10.659 4.412-.625.501-2.476 2.146-3.56 4.79-3.661-1.757-8.695-5.112-11.793-7.177l-.193-.129c1.044-4.178.099-7.531-.891-9.625-5.586-11.816-24.129-10.891-27.787-10.58-2.078.174-4.707.267-7.488.365-4.368.155-9.196.329-13.973.865l.246-.686c3.626-10.103 13.274-16.891 24.008-16.891h5.685c5.521 0 9.999-4.478 9.999-9.999 0-5.521-4.478-9.999-9.999-9.999h-5.685c-15.936 0-30.529 8.387-38.708 21.588l-14.915-20.893 14.674-35.569L244.787 60.5a10.004 10.004 0 0 0 4.511-3.203l28.763-36.079c73.494 6.991 142.674 48.197 182.316 116.859a233.354 233.354 0 0 1 23.563 57.236l-4.239 3.78a26.708 26.708 0 0 0-8.899 19.429 9.57 9.57 0 0 1-.006.241l-6.906-18.992a24.964 24.964 0 0 0-4.503-7.724l-12.319-14.423a25.06 25.06 0 0 0-19.081-8.796h-15.079a14.46 14.46 0 0 0-12.77 7.649 14.46 14.46 0 0 0 .72 14.868l1.526 2.291c-9.744 8.379-21.014 15.084-33.014 19.606l-20.67-39.593v-8.833a9.994 9.994 0 0 0-3.095-7.232l-18.613-17.769a10.013 10.013 0 0 0-3.59-2.201l-16.755-5.888c-5.213-1.834-10.919.909-12.749 6.118-1.831 5.211.908 10.918 6.118 12.749l14.724 5.175 13.962 13.327v7.008c0 1.611.39 3.199 1.136 4.628l25.877 49.567a9.995 9.995 0 0 0 12.323 4.754l7.535-2.778c17.505-6.456 33.73-16.841 46.922-30.031a9.998 9.998 0 0 0 1.249-12.617l-.532-.799h4.775a5.09 5.09 0 0 1 3.876 1.787l12.319 14.423c.397.465.704.991.914 1.568l13.595 37.383a10 10 0 0 0 16.466 3.652l6.471-6.471c4.098-4.099 6.919-9.285 8.267-15.034 10.008 80.205-21.441 163.173-87.915 215.347-4.345 3.409-5.103 9.694-1.692 14.039 3.409 4.345 9.693 5.103 14.039 1.692 47.992-37.667 80.962-91.542 92.837-151.701 11.986-60.739 1.521-123.754-29.47-177.432zM47.282 282.747l41.233 31.351a9.99 9.99 0 0 0 4.135 1.854l24.852 4.856c3.172.62 5.818 2.496 7.453 5.284 1.635 2.787 1.979 6.012.973 9.083a30.91 30.91 0 0 0-.027 19.307l3.168 9.748c1.893 5.826-1.309 12.107-7.134 14l-9.937 3.229a9.997 9.997 0 0 0-6.73 7.628l-7.998 41.749c-17.583-16.093-33.021-35.113-45.552-56.818-15.288-26.477-24.84-54.718-29.05-83.274l24.614-7.997zm58.277-159.489-11.763 12.603a10.041 10.041 0 0 0-1.367 1.853L65.717 184.35l-23.741 16.976a9.999 9.999 0 0 0-2.446 13.767l8.879 13.024c-5.118.762-9.711 1.39-12.765 1.723a160.453 160.453 0 0 0-1.836-1.724c-2.377-2.208-5.68-5.157-10.604-9.466 8.121-50.263 32.341-97.615 70.433-133.76 7.294 2.297 13.28 7.738 16.204 14.835 3.29 7.982 1.608 17.22-4.282 23.533zm81.53 54.643c4.46-2.51 14.812-2.877 22.37-3.145 3.029-.107 5.891-.209 8.447-.423 1.349-.113 2.847-.092 4.26.018a9.993 9.993 0 0 0 4.6 12.441c1.876 1.004 4.487 2.745 7.251 4.588 7.815 5.21 16.674 11.115 24.996 11.645 7.568.491 11.779-3.822 13.583-5.659.144-.146.28-.292.424-.425a10.713 10.713 0 0 0 2.676-3.277c1.599.457 3.279.912 5.001 1.379 5.921 1.603 16.942 4.587 19.377 7.167 4.325 4.585 7.696 13.312 10.671 21.011 1.503 3.891 2.923 7.563 4.516 10.968.684 1.461 1.357 2.966 2.041 4.49 4.614 10.292 9.844 21.958 20.939 29.21 5.031 3.289 11.198 4.234 16.64 5.069.658.101 1.412.217 2.178.343-3.23 4.506-7.829 8.788-12.688 13.313-12.379 11.528-27.785 25.876-20.69 48.765 3.349 10.808 3.505 11.976-1.88 17.834-.734.799-1.418 1.527-2.059 2.209-4.612 4.91-8.255 8.788-11.271 18.288-.876 2.759-2.011 4.037-4.072 6.357-1.648 1.856-3.701 4.168-5.594 7.408-2.268 3.882-3.018 7.62-3.619 10.623-.593 2.955-.929 4.438-2.089 5.862-2.641 3.242-7.567 7.95-12.624 11.163-4.7 2.984-7.444 3.392-8.379 3.336-1.067-1.144-4.932-6.153-10.772-23.486-1.44-4.276-3.438-8.676-5.37-12.931-4.259-9.38-8.662-19.08-6.52-25.709.253-.782.503-1.546.749-2.293 3.422-10.43 6.652-20.279.668-34.619-1.822-4.367-4.723-7.558-7.28-10.374-1.655-1.821-3.53-3.885-3.819-5.073-.352-1.449-.341-3.122-.328-5.059.034-5.225.086-13.12-7.763-20.47-11.066-10.358-23.97-7.167-32.51-5.055-2.623.648-5.101 1.262-7.297 1.52-14.048 1.646-26.59-3.654-34.42-14.55-8.191-11.397-9.38-26.734-3.102-40.024 3.039-6.431 7.63-11.598 12.946-17.578 1.161-1.307 2.333-2.625 3.505-3.975 1.95-2.248 4.096-5.292 6.365-8.515 2.709-3.845 7.753-11.005 9.943-12.367z"
                      fill="#b2c59a"
                      opacity="1"
                      data-original="#000000"
                      class=""></Path>
                    <Path
                      d="m410.022 344.278-4.811-18.134a10 10 0 0 0-8.478-7.364 10.015 10.015 0 0 0-9.976 5.161c-1.096 2.02-2.083 4.16-3.037 6.229-1.605 3.481-3.265 7.081-4.992 9.068-.97 1.116-3.462 2.319-5.87 3.481-5.757 2.778-13.642 6.583-16.654 16.185-1.87 5.956-1.172 10.668-.662 14.108.441 2.983.543 4.017-.256 5.893l-.1.233c-3.183 7.469-9.105 21.374-.801 33.195 5.925 8.436 12.155 10.605 16.996 10.605a16.23 16.23 0 0 0 2.666-.215c10.2-1.667 17.868-12.277 24.134-33.393l11.762-39.641a9.997 9.997 0 0 0 .079-5.411zm-31.012 39.363c-3.194 10.766-6.02 15.792-7.651 18.02-.188-.24-.392-.512-.61-.823-1.911-2.722.945-9.426 2.835-13.863l.101-.234c3.048-7.154 2.233-12.648 1.64-16.66-.381-2.569-.517-3.673-.04-5.19.392-1.247 2.735-2.457 6.265-4.161 1.565-.756 3.288-1.587 5.027-2.593l-7.567 25.504zM270.03 118.86l-.675-.236c-5.207-1.824-10.917.915-12.745 6.126-1.828 5.212.915 10.917 6.126 12.745l.674.236a9.982 9.982 0 0 0 3.31.566c4.128 0 7.992-2.577 9.436-6.692 1.828-5.212-.915-10.918-6.126-12.745z"
                      fill="#b2c59a"
                      opacity="1"
                      data-original="#000000"
                      class=""></Path>
                  </G>
                </Svg>
                <View style={{width: '2.4%'}} />
                <View style={styles.textContainer}>
                  <Text style={[styles.featureTitle, globalstyles.outfit]}>
                    {t('HomeScreen.Community')}
                  </Text>
                  <Text
                    style={[
                      styles.featureSubtitle,
                      globalstyles.outfit,
                      {color: '#778c5e'},
                    ]}>
                    {t('HomeScreen.Community descript')}
                  </Text>
                </View>
              </TouchableOpacity>
            </CardView>

            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TouchableOpacity
                onPress={() => handleFeatureSelect('Detection')}
                style={[styles.featureButton, {backgroundColor: '#e7dcff'}]}>
                <Svg
                  version="1.1"
                  width="44"
                  height="44"
                  x="0"
                  y="0"
                  viewBox="0 0 24 24"
                  style="enable-background:new 0 0 512 512"
                  class="">
                  <G>
                    <Path
                      d="M20 3.5H4A2.503 2.503 0 0 0 1.5 6v12A2.503 2.503 0 0 0 4 20.5h16a2.503 2.503 0 0 0 2.5-2.5V6A2.503 2.503 0 0 0 20 3.5zM21.5 18a1.502 1.502 0 0 1-1.5 1.5H4A1.502 1.502 0 0 1 2.5 18V6A1.502 1.502 0 0 1 4 4.5h16A1.502 1.502 0 0 1 21.5 6zm-11.146-6.354a.5.5 0 0 1 0 .707l-4 4a.5.5 0 0 1-.707-.707L9.293 12 5.646 8.354a.5.5 0 0 1 .707-.707zM18.5 16a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h6a.5.5 0 0 1 .5.5z"
                      fill="#b69fca"
                      opacity="1"
                      class=""></Path>
                  </G>
                </Svg>
                <View style={{width: '2.4%'}} />
                <View style={styles.textContainer}>
                  <Text style={[styles.featureTitle, globalstyles.outfit]}>
                    {t('HomeScreen.Detection')}
                  </Text>
                  <Text
                    style={[
                      styles.featureSubtitle,
                      globalstyles.outfit,
                      {color: '#997aaa'},
                    ]}>
                    {t('HomeScreen.Detection descript')}
                  </Text>
                </View>
              </TouchableOpacity>
            </CardView>
            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TouchableOpacity
                onPress={() => handleFeatureSelect('Health')}
                style={[styles.featureButton, {backgroundColor: '#e9fded'}]}>
                <Svg
                  width="44"
                  height="44"
                  x="0"
                  y="0"
                  viewBox="0 0 512.001 512"
                  style="enable-background:new 0 0 512 512"
                  class="">
                  <G>
                    <Path
                      d="M256 455.516c-7.29 0-14.316-2.641-19.793-7.438-20.684-18.086-40.625-35.082-58.219-50.074l-.09-.078c-51.582-43.957-96.125-81.918-127.117-119.313C16.137 236.81 0 197.172 0 153.871c0-42.07 14.426-80.883 40.617-109.293C67.121 15.832 103.488 0 143.031 0c29.555 0 56.621 9.344 80.446 27.77C235.5 37.07 246.398 48.453 256 61.73c9.605-13.277 20.5-24.66 32.527-33.96C312.352 9.344 339.418 0 368.973 0c39.539 0 75.91 15.832 102.414 44.578C497.578 72.988 512 111.801 512 153.871c0 43.3-16.133 82.938-50.777 124.738-30.993 37.399-75.532 75.356-127.106 119.309-17.625 15.016-37.597 32.039-58.328 50.168a30.046 30.046 0 0 1-19.789 7.43zM143.031 29.992c-31.066 0-59.605 12.399-80.367 34.914-21.07 22.856-32.676 54.45-32.676 88.965 0 36.418 13.535 68.988 43.883 105.606 29.332 35.394 72.961 72.574 123.477 115.625l.093.078c17.66 15.05 37.68 32.113 58.516 50.332 20.961-18.254 41.012-35.344 58.707-50.418 50.512-43.051 94.137-80.223 123.469-115.617 30.344-36.618 43.879-69.188 43.879-105.606 0-34.516-11.606-66.11-32.676-88.965-20.758-22.515-49.3-34.914-80.363-34.914-22.758 0-43.653 7.235-62.102 21.5-16.441 12.719-27.894 28.797-34.61 40.047-3.452 5.785-9.53 9.238-16.261 9.238s-12.809-3.453-16.262-9.238c-6.71-11.25-18.164-27.328-34.61-40.047-18.448-14.265-39.343-21.5-62.097-21.5zm0 0"
                      fill="#a7d7c0"
                      opacity="1"></Path>
                  </G>
                </Svg>
                <View style={{width: '2.4%'}} />
                <View style={styles.textContainer}>
                  <Text style={[styles.featureTitle, globalstyles.outfit]}>
                    {t('HomeScreen.Health')}
                  </Text>
                  <Text
                    style={[
                      styles.featureSubtitle,
                      globalstyles.outfit,
                      {color: '#6ab095'},
                    ]}>
                    {t('HomeScreen.Health descript')}
                  </Text>
                </View>
              </TouchableOpacity>
            </CardView>
          </View>
          <View style={globalstyles.marginRight} />
        </View>
      </View>

      {/* overlay to fill in personal information  */}
      {showOverlay && (
        <View style={styles.overlay}>
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
              {t('HomeScreen.Get Started')}
            </Text>
            <Text
              style={[
                {
                  color: '#ffffff',
                },
                globalstyles.outfit,
              ]}>
              {t('HomeScreen.complete your profile')}
            </Text>
          </View>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={5}
            style={{width: '80%'}}>
            <TextInput
              placeholderTextColor="#555555"
              placeholder={t('Settings.Username')}
              value={username}
              onChangeText={setUsername}
              style={[styles.input, globalstyles.outfit]}
            />
          </CardView>
          <View
            style={{
              flexDirection: 'row', // Horizontal direction
              alignItems: 'center',
              width: '80%',
            }}>
            <CardView
              cardElevation={4}
              cardMaxElevation={4}
              cornerRadius={5}
              style={{width: '47.5%'}}>
              <TextInput
                placeholderTextColor="#555555"
                placeholder={t('Settings.Weight')}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                style={[styles.input, globalstyles.outfit]}
              />
            </CardView>
            <View style={{width: '5%'}} />
            <CardView
              cardElevation={4}
              cardMaxElevation={4}
              cornerRadius={5}
              style={{width: '47.5%'}}>
              <TouchableOpacity
                onPress={() => {
                  setWeightUnitsDropdownVisible(true);
                }}
                style={[styles.input]}>
                {weightUnits === '' ? (
                  <View
                    style={{
                      flexDirection: 'row', // Horizontal direction
                      alignItems: 'center',
                    }}>
                    <Text style={[globalstyles.outfit, {color: '#555555'}]}>
                      {t('Settings.Units')}
                    </Text>
                    <Svg
                      fill="#b0b0b0"
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
                ) : (
                  <Text style={[globalstyles.outfit, {color: '#555555'}]}>
                    {t(`Settings.weightUnits.${weightUnits}`)}
                  </Text>
                )}
              </TouchableOpacity>
            </CardView>
          </View>
          <View
            style={{
              flexDirection: 'row', // Horizontal direction
              alignItems: 'center',
              width: '80%',
            }}>
            {heightUnits === 'Meters (m)' ? (
              <View
                style={{
                  flexDirection: 'row', // Horizontal direction
                  alignItems: 'center',
                }}>
                <CardView
                  cardElevation={4}
                  cardMaxElevation={4}
                  cornerRadius={5}
                  style={{width: '47.5%'}}>
                  <TextInput
                    placeholderTextColor="#555555"
                    placeholder={t('Settings.Height')}
                    value={heightMeter}
                    onChangeText={setHeightMeter}
                    keyboardType="numeric"
                    style={[styles.input, globalstyles.outfit]}
                  />
                </CardView>
                <View style={{width: '5%'}} />
                <CardView
                  cardElevation={4}
                  cardMaxElevation={4}
                  cornerRadius={5}
                  style={{width: '47.5%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setHeightUnitsDropdownVisible(true);
                    }}
                    style={[styles.input]}>
                    {heightUnits === '' ? (
                      <View
                        style={{
                          flexDirection: 'row', // Horizontal direction
                          alignItems: 'center',
                        }}>
                        <Text style={[globalstyles.outfit, {color: '#555555'}]}>
                          {t('Settings.Units')}
                        </Text>
                        <Svg
                          fill="#b0b0b0"
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
                    ) : (
                      <Text style={[globalstyles.outfit, {color: '#555555'}]}>
                        {t(`Settings.heightUnits.${heightUnits}`)}
                      </Text>
                    )}
                  </TouchableOpacity>
                </CardView>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row', // Horizontal direction
                  alignItems: 'center',
                }}>
                <CardView
                  cardElevation={4}
                  cardMaxElevation={4}
                  cornerRadius={5}
                  style={{width: '30%'}}>
                  <TextInput
                    placeholderTextColor="#555555"
                    placeholder={
                      heightUnits !== ''
                        ? t('Settings.Height')
                        : t('Settings.ft')
                    }
                    value={heightFeet}
                    onChangeText={setHeightFeet}
                    keyboardType="numeric"
                    style={[styles.input, globalstyles.outfit]}
                  />
                </CardView>
                <View style={{width: '5%'}} />
                <CardView
                  cardElevation={4}
                  cardMaxElevation={4}
                  cornerRadius={5}
                  style={{width: '30%'}}>
                  <TextInput
                    placeholderTextColor="#555555"
                    placeholder={
                      heightUnits !== ''
                        ? t('Settings.Height')
                        : t('Settings.in')
                    }
                    value={heightInch}
                    onChangeText={setHeightInch}
                    keyboardType="numeric"
                    style={[styles.input, globalstyles.outfit]}
                  />
                </CardView>
                <View style={{width: '5%'}} />
                <CardView
                  cardElevation={4}
                  cardMaxElevation={4}
                  cornerRadius={5}
                  style={{width: '30%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setHeightUnitsDropdownVisible(true);
                    }}
                    style={[styles.input]}>
                    {heightUnits === '' ? (
                      <View
                        style={{
                          flexDirection: 'row', // Horizontal direction
                          alignItems: 'center',
                        }}>
                        <Text style={[globalstyles.outfit, {color: '#555555'}]}>
                          {t('Settings.Units')}
                        </Text>
                        <Svg
                          fill="#b0b0b0"
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
                    ) : (
                      <Text style={[globalstyles.outfit, {color: '#555555'}]}>
                        {t(`Settings.heightUnits.${heightUnits}`)}
                      </Text>
                    )}
                  </TouchableOpacity>
                </CardView>
              </View>
            )}
          </View>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={5}
            style={{width: '80%'}}>
            <TextInput
              placeholderTextColor="#555555"
              placeholder={t('Settings.Age')}
              value={age}
              onChangeText={setAge}
              style={[styles.input, globalstyles.outfit]}
              keyboardType="numeric"
            />
          </CardView>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={5}
            style={{width: '80%'}}>
            <TextInput
              placeholderTextColor="#555555"
              placeholder={t('Settings.Allergies')}
              value={allergies}
              onChangeText={setAllergies}
              style={[styles.input, globalstyles.outfit]}
            />
          </CardView>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={5}
            style={{width: '80%'}}>
            <TouchableOpacity
              onPress={() => {
                setSexDropdownVisible(true);
              }}
              style={[styles.input]}>
              {sex === '' ? (
                <View
                  style={{
                    flexDirection: 'row', // Horizontal direction
                    alignItems: 'center',
                  }}>
                  <Text style={[globalstyles.outfit, {color: '#555555'}]}>
                    {t('Settings.Sex')}
                  </Text>
                  <Svg
                    fill="#b0b0b0"
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
              ) : (
                <Text style={[globalstyles.outfit, {color: '#555555'}]}>
                  {t(`Settings.sex.${sex}`)}
                </Text>
              )}
            </TouchableOpacity>
          </CardView>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={5}
            style={{width: '80%'}}>
            <TextInput
              placeholderTextColor="#555555"
              placeholder={t('Settings.Health Conditions')}
              value={healthConditions}
              onChangeText={setHealthConditions}
              style={[styles.input, globalstyles.outfit]}
            />
          </CardView>
          <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
            <TouchableOpacity
              style={[styles.continueButton, styles.margin]}
              onPress={handlePersonalInfoContinue}>
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
      )}

      {/* sex drop down */}
      {isSexDropdownVisible && (
        <View style={[styles.popupContainer]}>
          <View style={styles.popup}>
            <Text
              style={[
                globalstyles.headerTitle,
                globalstyles.outfit,
                {
                  color: '#454f3f',
                  fontWeight: '600',
                  fontSize: 40,
                  //   paddingLeft: 15,
                },
              ]}>
              {t('Settings.Sex')}
            </Text>
            {sexOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownOption,
                  {
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                  },
                ]}
                onPress={() => handleSexPress(index)}>
                <Text style={{color: '#555555'}}>
                  {t(`Settings.sex.${option}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* height units drop down */}
      {isHeightUnitsDropdownVisible && (
        <View style={[styles.popupContainer]}>
          <View style={styles.popup}>
            <Text
              style={[
                globalstyles.headerTitle,
                globalstyles.outfit,
                {
                  color: '#454f3f',
                  fontWeight: '600',
                  fontSize: 40,
                  //   paddingLeft: 15,
                },
              ]}>
              {t('Settings.Height Units')}
            </Text>
            {heightUnitOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownOption,
                  {
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                  },
                ]}
                onPress={() => handleHeightUnitsPress(index)}>
                <Text style={{color: '#555555'}}>
                  {t(`Settings.heightUnits.${option}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* weight units drop down */}
      {isWeightUnitsDropdownVisible && (
        <View style={[styles.popupContainer]}>
          <View style={styles.popup}>
            <Text
              style={[
                globalstyles.headerTitle,
                globalstyles.outfit,
                {
                  color: '#454f3f',
                  fontWeight: '600',
                  fontSize: 40,
                  //   paddingLeft: 15,
                },
              ]}>
              {t('Settings.Weight Units')}
            </Text>
            {weightUnitOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownOption,
                  {
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                  },
                ]}
                onPress={() => handleWeightUnitsPress(index)}>
                <Text style={{color: '#555555'}}>
                  {t(`Settings.weightUnits.${option}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownOption: {
    paddingVertical: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 4,
  },
  popup: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: '#ec9751', // orange
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    height: '70%',
    top: 0,
    right: 0,
    left: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 9,
    paddingLeft: 15,
    borderRadius: 12,
    // Add more styling
    color: '#555555',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  verticallyCentered: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    marginTop: '-3%', // Move up by 10% of the container's height
  },
  hstack: {
    // position: 'absolute',
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items vertically
    justifyContent: 'space-between', // Align items with equal space between them
    marginLeft: '3%', // Add left margin to create space from the left edge of the screen
    marginRight: '3%', // Add right margin to create space from the right edge of the screen
  },
  hstackflex: {
    marginLeft: '3%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  continueButton: {
    backgroundColor: 'white', // Adjust colors accordingly
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    // Add more styling
  },
  safeArea: {
    flex: 1,
  },
  // Define your styles for the HomeScreen here
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  space: {
    height: '10%', // for bottom padding
  },
  featuresContainer: {
    flex: 1, // Full height
    // backgroundColor: '#e8fcb4', // Set the background color for the entire container
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center content
    height: 550,
  },
  featuresSection: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    width: '95%', // Take up all available width
    alignItems: 'center', // Center items horizontally
    // backgroundColor: '#D0FF6C', // Background color for the feature buttons
    // Add any additional padding or margins you may need here
    borderRadius: 30,
  },
  featureButton: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Align items vertically
    // backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    marginVertical: 10, // Margin between buttons
    width: '90%', // Use a percentage of container width
    // shadowColor: '#000', // Shadow color
    // shadowOffset: {width: 0, height: 1}, // Shadow offset
    // shadowOpacity: 0.2, // Shadow opacity
    // shadowRadius: 2, // Shadow blur radius
    // elevation: 3, // Elevation for Android
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Space between the icon and the title
    color: '#45554f', // Dark text for better readability
    width: '85%',
  },
  featureSubtitle: {
    fontSize: 11,
    // color: '#666', // Slightly lighter color for the subtitle
    width: '85%',
    marginLeft: 10,
  },
  icon: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  welcomeMessage: {
    fontSize: 24, // Adjust font size for welcome message
    fontWeight: 'bold', // Bold font weight for welcome message
    color: 'black', // Black color for text
    marginVertical: 20, // Space above and below the welcome message
  },
  textContainer: {
    flex: 1,
  },
  bgcontainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafff5',
    // backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e8fcb4',
  },
  iconButton: {
    padding: 8, // You can adjust padding as needed
  },
  icon: {
    width: 44, // Specify the width
    height: 44, // Specify the height
    resizeMode: 'contain', // Keep the icon aspect ratio
  },
  loginButton: {
    backgroundColor: '#E5D1FF',
    padding: 8,
    borderRadius: 5,
    width: 181,
    height: 41,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#333',
    fontSize: 19.6,
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

// useFocusEffect(
//   React.useCallback(() => {
//     console.log(`phone number = ${phoneNumber}`);
//     if (phoneNumber === null) {
//       handleLoginPress();
//     } else {
//       fetchData();
//     }
//   }),
// );

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
