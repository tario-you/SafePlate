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
const SettingItem = ({title, lang, beta}) => {
  return (
    <CardView
      cardElevation={4}
      cardMaxElevation={4}
      cornerRadius={5}
      style={{zIndex: 3}}>
      <TouchableOpacity
        onPress={() => handleLanguageSwitch(lang)}
        style={[styles.settingItem]}>
        <Text style={[styles.settingText, globalstyles.outfit]}>
          <Text>{title} </Text>
          {beta && <Text style={{color: '#ff7070'}}>(beta)</Text>}
          {title === 'nothing' && (
            <Text style={{color: '#ff7070'}}>(debug)</Text>
          )}
        </Text>
        <Image
          source={require('../assets/imgs/arrow.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </CardView>
  );
};

const SettingsScreen_Language = ({navigation}) => {
  const {t, i18n} = useTranslation(); //i18n instance

  handleLanguageSwitch = lang => {
    console.log(`switching language to ${lang}`);
    i18n.changeLanguage(lang);
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
            {t('Settings.language')}
          </Text>
        </View>
        <View style={globalstyles.marginRight} />
      </View>
      <ScrollView>
        <SettingItem title="English" lang={'en'} />
        <SettingItem title="简体中文" lang={'cn'} />
        <SettingItem title="繁體中文" lang={'tw'} />
        <SettingItem title="Русский" lang={'ru'} />
        <SettingItem title="Español" lang={'sp'} />
        <SettingItem title="Français" lang={'fr'} />
        <SettingItem title="عربي" lang={'ar'} />
        <SettingItem title="nothing" lang={'nothing'} />
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

export default SettingsScreen_Language;
