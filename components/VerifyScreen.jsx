import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import Svg, {Path} from 'react-native-svg';
import Egg from '../assets/imgs/egg.svg';
import Pepper from '../assets/imgs/pepper.svg';
import BackButton from './BackButton';
const globalstyles = require('./GlobalStyles');

import {connect} from 'react-redux';
import {setActiveUser, setPhoneNumber} from './actions';

const VerifyScreen = ({
  navigation,
  route,
  phoneNumber,
  activeUser,
  setPhoneNumber,
  setActiveUser,
}) => {
  const {email} = route.params;
  const {t} = useTranslation();

  const [code, setCode] = useState(Array(6).fill(''));

  // Initialize refs array with 6 refs using `createRef` since there will be 6 input fields
  // const refs = useRef(
  //   Array(6)
  //     .fill(null)
  //     .map(() => React.createRef()),
  // );
  const refs = useRef(code.map(() => React.createRef()));

  useEffect(() => {
    console.log(`verifying with login email param of ${email}`);
  });

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move focus to next input if there's a next ref and current input has a value
    if (index < refs.current.length - 1 && text.length > 0) {
      refs.current[index + 1].current.focus(); // Correct way to access the focus method
    }
  };

  const handleContinue = () => {
    console.log('Verification code entered:', code.join(''));
    // check code
    setPhoneNumber(email);
    navigation.navigate('Home');
  };

  // Automatically focus the first input field when the component mounts
  useEffect(() => {
    refs.current[0].current.focus();
  }, []);

  return (
    <View style={styles.verificationscreen}>
      <Egg
        width={'50%'}
        height={'20%'}
        style={[globalstyles.fruitIcon, {right: '5%', top: '5%'}]}
      />
      <Pepper
        width={'50%'}
        height={'20%'}
        style={[globalstyles.fruitIcon, {bottom: '5%', left: '5%'}]}
      />

      <View style={globalstyles.topMargin} />
      <BackButton />

      <View style={globalstyles.verticallyCentered}>
        <View style={styles.hstack}>
          <View style={globalstyles.marginLeft} />
          <View>
            <Text
              style={[
                globalstyles.headerTitle,
                globalstyles.outfit,
                {color: '#454f3f', fontWeight: '600', fontSize: 40},
              ]}>
              {t('Verify.title')}
            </Text>
            <Text style={[{color: '#454f3f'}, globalstyles.outfit]}>
              {t('Verify.descript')}
            </Text>

            <View style={styles.codeInput}>
              {code.map((_, index) => (
                <View style={{marginRight: index < 5 ? 10 : 0}} key={index}>
                  <CardView
                    cardElevation={4}
                    cardMaxElevation={4}
                    cornerRadius={5}>
                    <TextInput
                      placeholderTextColor="#555555"
                      ref={refs.current[index]} // Attach ref
                      style={[styles.input, {color: '#555555'}]}
                      keyboardType="numeric"
                      maxLength={1}
                      value={code[index] || ''}
                      onChangeText={text => handleCodeChange(text, index)}
                    />
                  </CardView>
                </View>
              ))}
            </View>

            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={5}>
              <TouchableOpacity
                style={[styles.continueButton]}
                onPress={handleContinue}>
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
            {/* </View> */}
          </View>
          <View style={globalstyles.marginRight} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hstack: {
    // position: 'absolute',
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items vertically
    justifyContent: 'space-between', // Align items with equal space between them
    marginLeft: '5%', // Add left margin to create space from the left edge of the screen
    marginRight: '7%', // Add right margin to create space from the right edge of the screen
  },
  verificationscreen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafff5',
    // flexDirection: 'column',
    // alignItems: 'center',
    // backgroundColor: '#f2e8f8',
    // height: '100vh',
  },
  codeInput: {
    // backgroundColor: '#ffffff',
    // color: '#ffffff',
    // paddingHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  continueButton: {
    backgroundColor: '#ffffff', // Adjust colors accordingly
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    // Add more styling
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 9,
    width: 50,
    height: 60,
    textAlign: 'center',
    // paddingLeft: 15,
    borderRadius: 12,
    // Add more styling
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyScreen);
