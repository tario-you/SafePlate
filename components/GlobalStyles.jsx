'use strict';

import {StyleSheet} from 'react-native';

module.exports = StyleSheet.create({
  topMargin: {
    height: '5%', // for top padding
  },
  bottomMargin: {
    height: '5%', // for top padding
  },
  leftMargin: {
    width: 10, // for top padding
  },
  rightMargin: {
    width: 10, // for top padding
  },
  betweenPadding: {
    height: 6,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    // padding: 16,
    paddingBottom: 10,
    // marginLeft: 10, // Add spacing between the back arrow and title
    color: 'black',
  },
  outfitBlack: {
    fontFamily: 'Outfit-Black',
    fontSize: 20,
  },
  outfitBold: {
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
  },
  outfitExtraBold: {
    fontFamily: 'Outfit-ExtraBold',
    fontSize: 20,
  },
  outfitExtraLight: {
    fontFamily: 'Outfit-ExtraLight',
    fontSize: 20,
  },
  outfitLight: {
    fontFamily: 'Outfit-Light',
    fontSize: 20,
  },
  outfitMedium: {
    fontFamily: 'Outfit-Medium',
    fontSize: 20,
  },
  outfitRegular: {
    fontFamily: 'Outfit-Regular',
    fontSize: 20,
  },
  outfitSemiBold: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 20,
  },
  outfitThin: {
    fontFamily: 'Outfit-Thin',
    fontSize: 20,
  },
  outfit: {
    fontFamily: 'Outfit-VariableFont_wght',
    fontSize: 20,
  },
  fruitIcon: {
    position: 'absolute',
  },
  hstack: {
    // position: 'absolute',
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items vertically
    justifyContent: 'space-between', // Align items with equal space between them
    marginLeft: '7%', // Add left margin to create space from the left edge of the screen
    marginRight: '7%', // Add right margin to create space from the right edge of the screen
  },
  verticallyCentered: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    marginTop: '-35%', // Move up by 10% of the container's height
  },
});
