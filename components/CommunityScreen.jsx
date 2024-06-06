import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import AliyunOSS from 'aliyun-oss-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Clipboard,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import Pdf from 'react-native-pdf';
import Svg, {Circle, G, Path} from 'react-native-svg';
import BackButtonSvg from '../assets/imgs/right-arrow.svg';
import ArticleScreen from './ArticleScreen';
import BackButton from './BackButton';
var RNFS = require('react-native-fs');

const globalstyles = require('./GlobalStyles');

import {connect} from 'react-redux';
import {setActiveUser, setPhoneNumber} from './actions';

const CommunityScreen = ({
  phoneNumber,
  activeUser,
  setPhoneNumber,
  setActiveUser,
}) => {
  const {t} = useTranslation();

  const [commJSoriginal, setCommJSoriginal] = useState();

  const navigation = useNavigation();

  const [commJS, setCommJS] = useState([]);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const sortByOptions = [
    'recent',
    'popular',
    'blog',
    'event',
    'infographic',
    'article',
    'myposts',
  ];

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const sortByButtonRef = useRef(null);
  const [sortOption, setSortOption] = useState(sortByOptions[0]);

  useEffect(() => {
    // Retrieve sort option from AsyncStorage when component mounts
    retrieveSortOption();

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

    readFromCommunityJson();
    console.log(`the active user is ${activeUser}`);
  }, []); // Empty dependency array ensures this useEffect runs only once on component mount

  useEffect(() => {
    // Save sort option to AsyncStorage whenever it changes
    saveSortOption();
  }, [sortOption]);

  const retrieveSortOption = async () => {
    try {
      const value = await AsyncStorage.getItem('sortOption');
      if (value !== null) {
        setSortOption(value);
      }
    } catch (error) {
      console.error('Error retrieving sort option:', error);
    }
  };

  const saveSortOption = async () => {
    try {
      await AsyncStorage.setItem('sortOption', sortOption);
    } catch (error) {
      console.error('Error saving sort option:', error);
    }
  };

  const getIndex = (arr, elem) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == elem) {
        return i;
      }
    }
    return -1;
  };

  const sortByDate = () => {
    const sortedArticles = commJSoriginal.slice().sort((a, b) => {
      // Parse dates from strings in the format yyyy/mm/dd
      const dateA = a.date.split('/').map(Number);
      const dateB = b.date.split('/').map(Number);

      // Compare years
      if (dateB[0] !== dateA[0]) {
        return dateB[0] - dateA[0];
      }

      // Compare months
      if (dateB[1] !== dateA[1]) {
        return dateB[1] - dateA[1];
      }

      // Compare days
      return dateB[2] - dateA[2];
    });
    return sortedArticles;
  };

  const sortByPopularity = () => {
    const sortedArticles = commJSoriginal.slice().sort((a, b) => {
      // Sort by number of likes
      if (a.likes.length > b.likes.length) return -1;
      if (a.likes.length < b.likes.length) return 1;
      // If likes are the same, you can use another criterion,
      // for example, sorting by date
      // Make sure 'date' is the property that holds the publication date
      const dateA = new Date(a.date.replace(/-/g, '/'));
      const dateB = new Date(b.date.replace(/-/g, '/'));

      // Sort by date
      return dateB - dateA;
    });
    return sortedArticles;
  };

  const handleMyPostsPress = () => {
    handleSortOptionPress(6);
  };

  const handleSortOptionPress = index => {
    var option = sortByOptions[index];
    console.log('our option is %s', option);
    setSortOption(option);
    let sortedItems = [...commJSoriginal]; // Create a copy of the original items array
    switch (index) {
      case 0: // Recent
        sortedItems = sortByDate();
        break;
      case 1: // Popular
        sortedItems = sortByPopularity();
        break;
      case 2: // Blogs
        sortedItems = sortedItems.filter(item => item.category === 'blog');
        break;
      case 3: // Events
        sortedItems = sortedItems.filter(item => item.category === 'event');
        break;
      case 4: // Infographics
        sortedItems = sortedItems.filter(
          item => item.category === 'infographic',
        );
        break;
      case 5: // Articles
        sortedItems = sortedItems.filter(item => item.category === 'article');
        break;

      case 6: // my posts
        sortedItems = sortedItems.filter(item => item.author === activeUser);
        break;
      default:
        break;
    }

    setCommJS(sortedItems);
    // Hide the dropdown
    setDropdownVisible(false);
  };

  const readFromCommunityJson = async (toSort = false) => {
    AliyunOSS.asyncDownload('safeplate', 'community.json')
      .then(e => {
        console.log('successfully downloaded from community.json WOOF');
        console.log(e);
      })
      .catch(e => {
        console.log('failed to download :( WOOF');
        console.log(e);
      });

    const jsonData = await RNFS.readFile(
      RNFS.DocumentDirectoryPath + '/community.json',
      'utf8',
    );
    const data = JSON.parse(jsonData);
    console.log('fetched community data MEOW:');
    console.log(data);

    // set comm js original
    setCommJSoriginal(data);
    setCommJS(data);
    if (toSort) handleSortOptionPress(getIndex(sortByOptions, sortOption));
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleMakePostPress = () => {
    setPopupVisible(true); // 3. Show the popup
  };

  const handleCopyToClipboard = () => {
    Clipboard.setString('worldhealthinstitute.official@gmail.com');
    // Alert.alert('Copied!', 'The message has been copied to clipboard.');
    setPopupVisible(false);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var unreadNotifs = true;

  const handleProfilePress = () => {
    // navigation.navigate('Profile');
    console.log('hi');
  };

  const handleArticleClick = item => {
    navigation.navigate('Article', {item: item});
  };

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const updateLike = async index => {
    // read from aliyun
    AliyunOSS.asyncDownload('safeplate', 'community.json')
      .then(e => {
        console.log('successfully downloaded from community.json WOOF');
        console.log(e);
      })
      .catch(e => {
        console.log('failed to download :( WOOF');
        console.log(e);
      });

    const jsonData = await RNFS.readFile(
      RNFS.DocumentDirectoryPath + '/community.json',
      'utf8',
    );
    const data = JSON.parse(jsonData);
    console.log('fetched community data MEOW:');
    console.log(data);

    // set comm js original
    setCommJSoriginal(data);
    setCommJS(data);

    const newCommJS = [...data]; // Create a new copy of commJS
    if (getIndex(newCommJS[index].likes, activeUser) === -1) {
      newCommJS[index].likes.push(activeUser);
    } else {
      newCommJS[index].likes = removeItemOnce(
        newCommJS[index].likes,
        activeUser,
      );
    }
    setCommJS(newCommJS);

    await RNFS.writeFile(
      RNFS.DocumentDirectoryPath + '/community.json',
      JSON.stringify(newCommJS),
      'utf8',
    );

    // upload to aliyun
    AliyunOSS.asyncUpload(
      'safeplate',
      'community.json',
      RNFS.DocumentDirectoryPath + '/community.json',
    )
      .then(e => {
        console.log('successfully uplaoded to community.json');
        console.log(e);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <View style={styles.container}>
      <View style={globalstyles.topMargin} />
      {/* top bar */}
      <View style={[styles.hstackJustify]}>
        <BackButton />

        <CardView
          cardElevation={4}
          cardMaxElevation={4}
          cornerRadius={5}
          style={{zIndex: 3}}>
          <TouchableOpacity
            style={[styles.continueButton, {zIndex: 3, height: '13px'}]}
            onPress={handleMyPostsPress}>
            <View style={styles.hstackJustify}>
              <Text style={[{color: '#ffffff'}, globalstyles.outfit]}>
                {t('Community.myposts')}
              </Text>
            </View>
          </TouchableOpacity>
        </CardView>
      </View>

      <View style={styles.hstack}>
        <View style={globalstyles.marginLeft} />
        <View>
          <Text
            style={[
              globalstyles.headerTitle,
              globalstyles.outfit,
              {
                color: '#454f3f',
                fontWeight: '600',
                fontSize: 40,
                paddingLeft: 15,
              },
            ]}>
            {t('Community.title')}
          </Text>
        </View>
      </View>

      <View style={[styles.hstack, {paddingLeft: '4%'}]}>
        <CardView
          cardElevation={4}
          cardMaxElevation={4}
          cornerRadius={5}
          style={{zIndex: 3}}>
          <TouchableOpacity
            style={[styles.continueButton, {zIndex: 3, height: '13px'}]}
            onPress={toggleDropdown}
            ref={sortByButtonRef}>
            <View style={styles.hstackJustify}>
              <Text style={[{color: '#ffffff'}, globalstyles.outfit]}>
                {t(`Community.${sortOption}`)}
              </Text>
              <View style={{width: 10}} />

              <Svg
                fill="#ffffff"
                height="15"
                width="10"
                viewBox="0 0 330 330"
                style={{transform: [{rotate: '90deg'}]}}>
                <Path
                  id="XMLID_222_"
                  d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
	c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
	C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
	C255,161.018,253.42,157.202,250.606,154.389z"
                />
              </Svg>
              {/* <BackButtonSvg
                width="20"
                height="30"
                style={{transform: [{rotate: '90deg'}]}}
              /> */}
            </View>
          </TouchableOpacity>
        </CardView>
        <View style={{width: '4%'}} />
        <CardView
          cardElevation={4}
          cardMaxElevation={4}
          cornerRadius={5}
          style={{zIndex: 3}}>
          <TouchableOpacity
            style={[styles.continueButton, {zIndex: 3, height: '13px'}]}
            onPress={handleMakePostPress}>
            <View style={styles.hstackJustify}>
              <Text style={[{color: '#ffffff'}, globalstyles.outfit]}>
                {t('Community.make')}
              </Text>
            </View>
          </TouchableOpacity>
        </CardView>

        {/* 
        notification bell: 
        <View style={{width: '4%'}} />
        <CardView
          cardElevation={4}
          cardMaxElevation={4}
          cornerRadius={5}
          style={{zIndex: 3}}>
          <TouchableOpacity>
            <Svg
              version="1.1"
              width="40"
              height="40"
              x="0"
              y="0"
              viewBox="0 0 24 24"
              style="enable-background:new 0 0 512 512"
              class="">
              <G>
                <G fill="#6a845d">
                  <Path
                    d="m4.455 13.88-.571-.486zm.88-2.042.745.085zm13.33 0 .745-.084zm.88 2.042.571-.486zM18.32 8.794l-.745.084zm-12.64 0-.746-.084zm12.49 7.456H5.83v1.5h12.34zm-.595-7.372.345 3.045 1.49-.169-.344-3.044zM6.08 11.923l.345-3.045-1.49-.168-.345 3.044zm-1.053 2.443c.585-.688.95-1.54 1.053-2.443l-1.49-.169a3.067 3.067 0 0 1-.706 1.64zm12.893-2.443a4.568 4.568 0 0 0 1.053 2.443l1.143-.972a3.066 3.066 0 0 1-.706-1.64zM5.83 16.25c-.887 0-1.45-1.122-.803-1.884l-1.143-.972c-1.42 1.67-.306 4.356 1.946 4.356zm12.34 1.5c2.252 0 3.365-2.685 1.946-4.356l-1.143.972c.648.762.084 1.884-.803 1.884zm.896-9.04C18.65 5.045 15.628 2.25 12 2.25v1.5c2.83 0 5.242 2.187 5.575 5.128zm-12.641.168C6.758 5.937 9.17 3.75 12 3.75v-1.5c-3.628 0-6.65 2.795-7.066 6.46zM15.702 19.263a.75.75 0 1 0-1.404-.526zm-6-.526a.75.75 0 1 0-1.404.526zm4.596 0c-.323.86-1.213 1.513-2.298 1.513v1.5c1.685 0 3.152-1.017 3.702-2.487zM12 20.25c-1.085 0-1.975-.652-2.298-1.513l-1.404.526c.55 1.47 2.017 2.487 3.702 2.487z"
                    fill="#6a845d"
                    opacity="1"
                    data-original="#6a845d"
                    class=""></Path>
                </G>
              </G>
              {unreadNotifs && <Circle cx="17" cy="5" r="3" fill="#ff7070" />}
            </Svg>
          </TouchableOpacity>
        </CardView> */}
      </View>

      {/* feed scroll */}
      <ScrollView>
        <View style={{marginTop: 5}} />
        {commJS.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              handleArticleClick(item);
            }}
            // Conditionally render TouchableOpacity based on commJS.includes(item)
            style={{display: commJS.includes(item) ? 'flex' : 'none'}}>
            <CardView
              cardElevation={4}
              cardMaxElevation={4}
              cornerRadius={5}
              style={{zIndex: 3}}>
              <View key={index} style={styles.card}>
                <Text style={[styles.title, globalstyles.outfit]}>
                  {item.title}
                </Text>
                <Text style={styles.description}>{item.author}</Text>
                <CardView
                  cardElevation={4}
                  cardMaxElevation={4}
                  cornerRadius={5}
                  style={{zIndex: 3}}>
                  <Image source={{uri: item.image}} style={styles.image} />
                </CardView>
                <View style={[{marginBottom: 10, flexDirection: 'row'}]}>
                  <TouchableOpacity
                    style={[{zIndex: 3}]}
                    onPress={() => {
                      updateLike(index);
                    }}>
                    <Svg
                      width="18"
                      height="18"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      style="enable-background:new 0 0 512 512"
                      class="">
                      <G>
                        <Path
                          fill={
                            getIndex(commJS[index].likes, activeUser) !== -1
                              ? '#ff0000'
                              : '#000000'
                          }
                          d="M256 455.516c-7.29 0-14.316-2.641-19.793-7.438-20.684-18.086-40.625-35.082-58.219-50.074l-.09-.078c-51.582-43.957-96.125-81.918-127.117-119.313C16.137 236.81 0 197.172 0 153.871c0-42.07 14.426-80.883 40.617-109.293C67.121 15.832 103.488 0 143.031 0c29.555 0 56.621 9.344 80.446 27.77C235.5 37.07 246.398 48.453 256 61.73c9.605-13.277 20.5-24.66 32.527-33.96C312.352 9.344 339.418 0 368.973 0c39.539 0 75.91 15.832 102.414 44.578C497.578 72.988 512 111.801 512 153.871c0 43.3-16.133 82.938-50.777 124.738-30.993 37.399-75.532 75.356-127.106 119.309-17.625 15.016-37.597 32.039-58.328 50.168a30.046 30.046 0 0 1-19.789 7.43zM143.031 29.992c-31.066 0-59.605 12.399-80.367 34.914-21.07 22.856-32.676 54.45-32.676 88.965 0 36.418 13.535 68.988 43.883 105.606 29.332 35.394 72.961 72.574 123.477 115.625l.093.078c17.66 15.05 37.68 32.113 58.516 50.332 20.961-18.254 41.012-35.344 58.707-50.418 50.512-43.051 94.137-80.223 123.469-115.617 30.344-36.618 43.879-69.188 43.879-105.606 0-34.516-11.606-66.11-32.676-88.965-20.758-22.515-49.3-34.914-80.363-34.914-22.758 0-43.653 7.235-62.102 21.5-16.441 12.719-27.894 28.797-34.61 40.047-3.452 5.785-9.53 9.238-16.261 9.238s-12.809-3.453-16.262-9.238c-6.71-11.25-18.164-27.328-34.61-40.047-18.448-14.265-39.343-21.5-62.097-21.5zm0 0"
                          opacity="1"
                        />
                      </G>
                    </Svg>
                  </TouchableOpacity>
                  <View style={{width: 5}} />
                  <Text style={styles.likes}>{commJS[index].likes.length}</Text>
                  <View style={{width: 10}} />
                  {/* message */}
                  <TouchableOpacity
                    style={[{zIndex: 3}]}
                    onPress={handleProfilePress}>
                    <Svg
                      version="1.1"
                      width="18"
                      height="18"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      style="enable-background:new 0 0 512 512"
                      class="">
                      <G>
                        <Path
                          d="M256 0C114.848 0 0 114.848 0 256c0 49.216 13.792 96.48 39.936 137.216L1.152 490.048a16.03 16.03 0 0 0 3.552 17.28A15.992 15.992 0 0 0 16 512c2.016 0 4-.384 5.952-1.152l96.832-38.784C159.52 498.208 206.784 512 256 512c141.152 0 256-114.848 256-256S397.152 0 256 0zm0 480c-45.632 0-89.312-13.504-126.272-39.072-2.688-1.888-5.888-2.848-9.088-2.848-2.016 0-4.032.384-5.952 1.152l-69.952 28.032 28.032-69.952c1.984-4.992 1.344-10.656-1.696-15.04C45.504 345.312 32 301.632 32 256 32 132.48 132.48 32 256 32s224 100.48 224 224-100.48 224-224 224z"
                          fill="#000000"
                          opacity="1"
                          data-original="#000000"
                          class=""
                        />
                      </G>
                    </Svg>
                  </TouchableOpacity>
                </View>
                <Text style={styles.description}>
                  {item.description.split(' ').slice(0, 30).join(' ') + '...'}
                </Text>
                <Text
                  style={[styles.date, globalstyles.outfit, {fontSize: '3'}]}>
                  {t(`Community.${item.category}`)} • {item.date}
                </Text>
              </View>
            </CardView>
          </TouchableOpacity>
        ))}
        <View style={{marginBottom: 30}} />
      </ScrollView>

      {/* copy popup */}
      {isPopupVisible && (
        <View style={styles.popupContainer}>
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
              {t('Community.Submit a piece')}
            </Text>
            <Text
              style={[
                globalstyles.outfit,
                {maxWidth: '70%', maxHeight: '60%'},
              ]}>
              {t('Community.submit description')}
            </Text>
            <TouchableOpacity onPress={() => handleCopyToClipboard()}>
              <Text style={[styles.copyButton, globalstyles.outfit]}>
                [Copy]
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* filter dropdown */}
      {isDropdownVisible && (
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
              {t('Community.Sort Options')}
            </Text>
            {sortByOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownOption,
                  {
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                  },
                ]}
                onPress={() => handleSortOptionPress(index)}>
                <Text>{t(`Community.${option}`)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sortByButton: {
    backgroundColor: '#6a845d',
    padding: 10,
    borderRadius: 5,
  },
  sortByText: {
    color: '#ffffff',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
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
  },
  popup: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  copyButton: {
    marginTop: 10,
    color: '#6a845d',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 40,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: '#b5b5b5',
  },
  likes: {
    fontSize: 16,
    color: '#333333',
  },
  hstack: {
    // position: 'absolute',
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items vertically
    // justifyContent: 'space-between', // Align items with equal space between them
    marginLeft: '5%', // Add left margin to create space from the left edge of the screen
    marginRight: '7%', // Add right margin to create space from the right edge of the screen
  },
  continueButton: {
    backgroundColor: '#6a845d', // Adjust colors accordingly
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    // Add more styling
  },
  hstackJustify: {
    // position: 'absolute',
    flexDirection: 'row', // Horizontal direction
    alignItems: 'center', // Align items vertically
    justifyContent: 'space-between', // Align items with equal space between them
    marginLeft: '3%', // Add left margin to create space from the left edge of the screen
    marginRight: '8%', // Add right margin to create space from the right edge of the screen
  },
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#f9fff4',
  },
  pdfcontainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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

export default connect(mapStateToProps, mapDispatchToProps)(CommunityScreen);
