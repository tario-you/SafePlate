import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import BackButton from './BackButton';

const globalstyles = require('./GlobalStyles');

const UnderDevelopment = ({navigation}) => {
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
            {t('UnderDevelopment.title')}
          </Text>
          <Text style={[globalstyles.outfitBold, {paddingBottom: 15}]}>
            {t('UnderDevelopment.comingsoon')}
          </Text>
          <Text style={[globalstyles.outfit, {paddingBottom: 15}]}>
            {t('UnderDevelopment.descript1')}
          </Text>
          <Text style={[globalstyles.outfit, {paddingBottom: 15}]}>
            {t('UnderDevelopment.descript2')}
          </Text>
          <Text style={[globalstyles.outfit, {paddingBottom: 15}]}>
            {t('UnderDevelopment.descript3')}
          </Text>
          <Text
            onPress={() =>
              Linking.openURL(
                'https://www.worldhealthinstitute.org/culinova-biosensor',
              )
            }
            style={[globalstyles.outfit, {color: '#454f3f'}]}>
            https://www.worldhealthinstitute.org/culinova-biosensor
          </Text>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#5b5b5b', // Use your app's primary color
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default UnderDevelopment;
