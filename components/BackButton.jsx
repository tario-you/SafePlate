import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BackButtonSvg from '../assets/imgs/right-arrow.svg';

const BackButton = ({fillColor = '#454f3f'}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <BackButtonSvg
          fill={fillColor}
          width="40"
          height="30"
          style={{transform: [{scaleX: -1}]}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#ccc',
    zIndex: 2,
  },
});

export default BackButton;
