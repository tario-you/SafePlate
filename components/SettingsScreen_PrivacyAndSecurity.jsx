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

const SettingsScreen_PrivacyAndSecurity = ({navigation}) => {
  const {t} = useTranslation();
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
            {t('Settings.privacy')}
          </Text>
          <Text style={[globalstyles.outfit, {paddingBottom: 5}]}>
            {t('Privacy.update')}: 2024/04/19
          </Text>
          <Text style={[globalstyles.outfit, {paddingBottom: 5, fontSize: 8}]}>
            {t('Privacy.credit')}:
            https://whitefuse.com/blog/privacy-policy-notice-template
          </Text>
        </View>
        <View style={globalstyles.marginRight} />
      </View>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <View style={{marginBottom: 10}} />
          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            1. {t('Privacy.1.title')}
          </Text>
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <View style={{marginBottom: 10}} />
            <Text>{t('Privacy.1.1')}</Text>
            <View style={{marginBottom: 10}} />
            <Text>{t('Privacy.1.2')}</Text>
            <View style={{marginBottom: 10}} />
            {/* Add marginBottom to create space */}

            <Text style={{marginLeft: 10}}>a. {t('Privacy.1.a')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>b. {t('Privacy.1.b')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>c. {t('Privacy.1.c')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>d. {t('Privacy.1.d')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>e. {t('Privacy.1.e')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>f. {t('Privacy.1.f')}</Text>
            <View style={{marginBottom: 10}} />
          </View>

          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            2. {t('Privacy.2.title')}
          </Text>
          <View style={{marginBottom: 10}} />
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <Text style={{marginLeft: 10}}>a. {t('Privacy.2.a')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>b. {t('Privacy.2.b')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>c. {t('Privacy.2.c')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>d. {t('Privacy.2.d')}</Text>
            <View style={{marginBottom: 10}} />
          </View>

          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            3. {t('Privacy.3.title')}
          </Text>
          <View style={{marginBottom: 10}} />
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <Text style={{marginLeft: 10}}>a. {t('Privacy.3.a')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>b. {t('Privacy.3.b')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>c. {t('Privacy.3.c')}</Text>
            <View style={{marginBottom: 10}} />
          </View>

          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            4. {t('Privacy.4.title')}
          </Text>
          <View style={{marginBottom: 10}} />
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <Text style={{marginLeft: 10}}>a. {t('Privacy.4.a')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>b. {t('Privacy.4.b')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>c. {t('Privacy.4.c')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>d. {t('Privacy.4.d')}</Text>
            <View style={{marginBottom: 10}} />
          </View>

          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            5. {t('Privacy.5.title')}
          </Text>
          <View style={{marginBottom: 10}} />
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <Text style={{marginLeft: 10}}>a. {t('Privacy.5.a')}</Text>
            <View style={{marginBottom: 10}} />
          </View>

          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            6. {t('Privacy.6.title')}
          </Text>
          <View style={{marginBottom: 10}} />
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <Text style={{marginLeft: 10}}>a. {t('Privacy.6.a')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>b. {t('Privacy.6.b')}</Text>
            <View style={{marginBottom: 10}} />
          </View>

          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            7. {t('Privacy.7.title')}
          </Text>
          <View style={{marginBottom: 10}} />
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <Text style={{marginLeft: 10}}>a. {t('Privacy.7.a')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>b. {t('Privacy.7.b')}</Text>
            <View style={{marginBottom: 10}} />
          </View>

          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            8. {t('Privacy.8.title')}
          </Text>
          <View style={{marginBottom: 10}} />
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <Text style={{marginLeft: 10}}>a. {t('Privacy.8.a')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>b. {t('Privacy.8.b')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>c. {t('Privacy.8.c')}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={{marginLeft: 10}}>d. {t('Privacy.8.d')}</Text>
            <View style={{marginBottom: 10}} />
          </View>

          <Text style={[{fontWeight: 'bold'}, globalstyles.outfit]}>
            9. {t('Privacy.9.title')}
          </Text>
          <View style={[{marginLeft: 10}, globalstyles.outfit]}>
            <View style={{marginBottom: 10}} />
            <Text>{t('Privacy.9.descript')}</Text>
            <View style={{marginBottom: 10}} />
          </View>
          <Text>{t('Privacy.end')}</Text>
          <View style={{marginBottom: 10}} />
          <View style={{marginBottom: 30}} />
        </ScrollView>
      </View>
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

export default SettingsScreen_PrivacyAndSecurity;
