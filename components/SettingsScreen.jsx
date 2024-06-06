import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import BackButton from './BackButton';
const globalstyles = require('./GlobalStyles');

const SettingItem = ({title, onPress}) => {
  return (
    <CardView
      cardElevation={4}
      cardMaxElevation={4}
      cornerRadius={5}
      style={{zIndex: 3}}>
      <TouchableOpacity onPress={onPress} style={styles.settingItem}>
        <Text style={[styles.settingText, globalstyles.outfit]}>{title}</Text>
        <Image
          source={require('../assets/imgs/arrow.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </CardView>
  );
};

const SettingsScreen = ({navigation}) => {
  const {t} = useTranslation();
  // Define your handlers for each settings item
  const handleLanguagePress = () => {
    console.log('Language setting pressed');
    navigation.navigate('Language');
  };

  const handleFamilyPress = () => {
    console.log('My Family setting pressed');
    navigation.navigate('Family');
    // Implement the navigation or functionality for the my family setting
  };

  const handlePrivacySecurityPress = () => {
    console.log('Privacy & Security setting pressed');
    navigation.navigate('Privacy');
  };

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
            {t('Settings.title')}
          </Text>
        </View>
        <View style={globalstyles.marginRight} />
      </View>
      <ScrollView>
        <SettingItem
          title={t('Settings.privacy')}
          onPress={handlePrivacySecurityPress}
        />
        <SettingItem
          title={t('Settings.language')}
          onPress={handleLanguagePress}
        />
        <SettingItem title={t('Settings.family')} onPress={handleFamilyPress} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default SettingsScreen;
