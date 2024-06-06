import AliyunOSS from 'aliyun-oss-react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import Svg, {Circle, ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import BackButton from './BackButton';
const globalstyles = require('./GlobalStyles');
var RNFS = require('react-native-fs');

import {connect} from 'react-redux';
import {setActiveUser, setPhoneNumber} from './actions';

const SettingItem = ({title, onPress}) => {
  return (
    <CardView
      cardElevation={4}
      cardMaxElevation={4}
      cornerRadius={5}
      style={{zIndex: 3}}>
      <TouchableOpacity onPress={onPress} style={[styles.settingItem]}>
        <Text style={[styles.settingText, globalstyles.outfit]}>
          <Text>{title} </Text>
        </Text>
        <Image
          source={require('../assets/imgs/arrow.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </CardView>
  );
};

const SettingsScreen_MyFamily = ({
  navigation,
  phoneNumber,
  activeUser,
  setPhoneNumber,
  setActiveUser,
}) => {
  const {t} = useTranslation(); //i18n instance

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

  const sexOptions = ['Male', 'Female'];
  const heightUnitOptions = ['Meters (m)', 'Feet (ft)'];
  const weightUnitOptions = ['Pounds (lb)', 'Kilograms (kg)'];

  const phonenumber = '1';
  const familyJSONpath = RNFS.DocumentDirectoryPath + '/users.json';
  const [userData, setUserData] = useState([]);
  const [activeEditUser, setActiveEditUser] = useState();
  const [editPopup, setEditPopup] = useState(false);

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

  const readFromJSON = async downloadFile => {
    try {
      // read from alicloud/users.json
      if (downloadFile) {
        console.log('downloading users.json from alicloud...');
        AliyunOSS.asyncDownload('safeplate', 'users.json')
          .then(e => {
            console.log(e);
          })
          .catch(e => {
            console.log(e);
          });
      }

      const jsonData = await RNFS.readFile(familyJSONpath, 'utf8');
      console.log('jsonData:', jsonData);
      const data = JSON.parse(jsonData);
      console.log('parsed json data:', data);
      return data;
    } catch (error) {
      console.error('Error reading data from family.json:', error);
    }
  };

  const fetchData = async (downloadFile = true) => {
    const data = await readFromJSON(downloadFile);
    for (var i = 0; i < data.length; i++) {
      user = data[i];
      console.log('viewing: ');
      console.log(user);
      if (user.phonenumber === phoneNumber) {
        console.log('found!');
        console.log(user);
        setUserData(user.members);
        break;
      }
    }
  };

  useEffect(() => {
    console.log('fetched that userdata is: ');
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    console.log('Phone Number:', phoneNumber);
    console.log('Active User:', activeUser);
    fetchData();
  }, []);

  const handleMemberPress = async username => {
    setActiveEditUser(username);
    const activeUserData = userData.filter(
      user => user.username === username,
    )[0];
    console.log(activeUserData);
    console.log(activeUserData.sex);

    setUsername(activeUserData.username);
    setWeight(activeUserData.weight);
    setWeightUnits(activeUserData.weightUnits);
    setHeightMeter(activeUserData.heightMeter);
    setHeightFeet(activeUserData.heightFeet);
    setHeightInch(activeUserData.heightInch);
    setHeightUnits(activeUserData.heightUnits);
    setAge(activeUserData.age);
    setAllergies(activeUserData.allergies);
    setSex(activeUserData.sex);
    setHealthConditions(activeUserData.healthConditions);

    setEditPopup(true);
  };

  const handleAddMemberPress = () => {
    setEditPopup(true);
  };

  const handleTrash = async () => {
    setEditPopup(false);
    await deleteUser();
  };

  const deleteUser = async () => {
    const allData = await readFromJSON();
    const matchingElement = allData.find(
      element => element.phonenumber === phoneNumber,
    );

    if (matchingElement) {
      // Check if the user exists in the matching element
      console.log(`activeEditUser = ${activeEditUser}`);
      var existingUserIndex = -1;
      for (var i = 0; i < matchingElement.members.length; i++) {
        if (matchingElement.members[i].username === activeEditUser) {
          existingUserIndex = i;
          break;
        }
      }
      if (existingUserIndex !== -1) {
        matchingElement.members.splice(existingUserIndex, 1);
        // console.log(matchingElement.members);
      }

      setActiveUser(matchingElement.members[0].username);

      await RNFS.writeFile(familyJSONpath, JSON.stringify(allData), 'utf8');
      console.log('Data written to family.json successfully!');

      console.log('uploading users.json to alicloud...');
      await AliyunOSS.asyncUpload('safeplate', 'users.json', familyJSONpath)
        .then(e => {
          console.log(e);
        })
        .catch(e => {
          console.log(e);
        });

      await fetchData(false);
    } else {
      console.error('couldnt find matching user for phone number');
    }
  };

  const handlePersonalInfoContinue = async () => {
    if (
      username !== '' &&
      weight !== 0 &&
      (heightMeter !== 0 || (heightFeet !== 0 && heightInch !== 0)) &&
      age !== 0 &&
      sex !== ''
    ) {
      console.log('can continue');
      setEditPopup(false);
      await commitEditToFamilyJSON();
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

  const commitEditToFamilyJSON = async () => {
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
        console.log(`activeEditUser = ${activeEditUser}`);
        var existingUserIndex = -1;
        for (var i = 0; i < matchingElement.members.length; i++) {
          if (matchingElement.members[i].username === activeEditUser) {
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

  // useEffect(() => {
  //   const configuration = {
  //     maxRetryCount: 3,
  //     timeoutIntervalForRequest: 30,
  //     timeoutIntervalForResource: 24 * 60 * 60,
  //   };

  //   const endpoint = 'oss-cn-beijing.aliyuncs.com';
  //   const accessKeyId = 'LTAI5tDmcm8oGXEUzErYN4Dz';
  //   const accessKeySecret = '5FxhJIoSojAXH10IHk6UJ3nWp3PwQT';

  //   AliyunOSS.initWithPlainTextAccessKey(
  //     accessKeyId,
  //     accessKeySecret,
  //     endpoint,
  //     configuration,
  //   );
  // });

  return (
    <View style={styles.container}>
      <View style={[globalstyles.topMargin]} />
      <BackButton />
      <View style={styles.hstack}>
        <View style={globalstyles.marginLeft} />
        <View>
          <Text
            style={[
              globalstyles.headerTitle,
              globalstyles.outfit,
              {color: '#454f3f', fontWeight: '600', fontSize: 40},
            ]}>
            {t('Settings.family')}
          </Text>
        </View>
        <View style={globalstyles.marginRight} />
      </View>
      <ScrollView styles={{width: '100% '}}>
        {userData &&
          userData.map(user => (
            <SettingItem
              title={user.username}
              onPress={() => handleMemberPress(user.username)}
            />
          ))}
        <SettingItem
          title={t('Settings.Add a family member')}
          onPress={handleAddMemberPress}
        />
      </ScrollView>

      {editPopup && (
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
              {t('Settings.Editing')}: {activeEditUser}
            </Text>
          </View>

          {/* username */}
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

          {/* height */}
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
                    style={[
                      styles.input,
                      {color: '#555555'},
                      globalstyles.outfit,
                    ]}
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
                    style={[
                      styles.input,
                      {color: '#555555'},
                      globalstyles.outfit,
                    ]}
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
                    style={[
                      styles.input,
                      {color: '#555555'},
                      globalstyles.outfit,
                    ]}
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

          {/* age */}
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

          {/* allergies */}
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

          {/* sex */}
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

          {/* health conditions */}
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
              style={[styles.input, {color: '#555555'}, globalstyles.outfit]}
            />
          </CardView>

          {/* trash can + continnue */}
          <View
            style={{
              flexDirection: 'row', // Horizontal direction
              alignItems: 'center',
              width: '80%',
            }}>
            <View
              style={{
                flexDirection: 'row', // Horizontal direction
                alignItems: 'center',
              }}>
              <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
                <TouchableOpacity
                  style={[styles.continueButton, {backgroundColor: '#EED5D1'}]}
                  onPress={handleTrash}>
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
                        d="M424 64h-88V48c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16H88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283C87.788 491.919 108.848 512 134.512 512h242.976c25.665 0 46.725-20.081 47.945-45.717L439.256 176H448c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zM208 48c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zM80 104c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40H80zm313.469 360.761A15.98 15.98 0 0 1 377.488 480H134.512a15.98 15.98 0 0 1-15.981-15.239L104.78 176h302.44z"
                        fill="#F0ABA8"
                        opacity="1"
                        class=""></Path>
                      <Path
                        d="M256 448c8.836 0 16-7.164 16-16V224c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16zM336 448c8.836 0 16-7.164 16-16V224c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16zM176 448c8.836 0 16-7.164 16-16V224c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"
                        fill="#F0ABA8"
                        opacity="1"
                        class=""></Path>
                    </G>
                  </Svg>
                </TouchableOpacity>
              </CardView>

              <View style={{width: '5%'}} />
              <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
                <TouchableOpacity
                  style={[styles.continueButton]}
                  onPress={handlePersonalInfoContinue}>
                  <View style={globalstyles.hstack}>
                    <Text style={[{color: '#6e8461'}, globalstyles.outfit]}>
                      {t('Login.continue')} & {t('Settings.Set as Active')}{' '}
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
          </View>
        </View>
      )}

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
  continueButton: {
    backgroundColor: 'white', // Adjust colors accordingly
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    // Add more styling
  },
  dropdownOption: {
    paddingVertical: 10,
    // width: '100%',
    // paddingHorizontal: '20%',
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
    backgroundColor: '#ec9751', // Orange color with transparency
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    height: '70%',
    bottom: 0,
    right: 0,
    left: 0,
    borderRadius: 24,
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 9,
    paddingLeft: 15,
    borderRadius: 12,
    color: '#555555',
  },
  hstack: {
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items verticall
    marginLeft: '5%', // Add left margin to create space from the left edge of the screen
    marginRight: '7%', // Add right margin to create space from the right edge of the screen
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fff4',
    padding: 20,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    alignSelf: 'stretch',
  },
  settingText: {
    fontSize: 16,
  },
  settingArrow: {
    fontSize: 16,
    color: '#ccc',
  },
  icon: {
    width: 10, // Specify the width
    height: 10, // Specify the height
    resizeMode: 'contain', // Keep the icon aspect ratio
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen_MyFamily);
