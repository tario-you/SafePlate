import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

import i18next, {t} from 'i18next';
import {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import Comments from 'react-native-comments';
import Pdf from 'react-native-pdf';
import Svg, {Circle, G, Path} from 'react-native-svg';
import BackButton from './BackButton';

import * as commentActions from './ExampleActions';
const globalstyles = require('./GlobalStyles');
const sampleCommentsRaw = require('../assets/sample_comments.json');

export default class ArticleScreen extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.actions = commentActions;
    this.state = {
      comments: [],
      loadingComments: true,
      lastCommentUpdate: null,
      review: props.review ? props.review : null,
      login: null,
      id: props.id,

      itemPdfHeight: this.props.route.params.item.pdfHeight,
      itemNumPages: this.props.route.params.item.numPages,
      itemPdfWidth: this.props.route.params.item.pdfWidth,
      itemImage: this.props.route.params.item.image,
      title: this.props.route.params.item.title,
      author: this.props.route.params.item.author,
      category: this.props.route.params.item.category,
      date: this.props.route.params.item.date,
      source: {
        uri: this.props.route.params.item.url,
        cache: true,
      },
      sampleComments: [],

      entirePdfHeight:
        (this.props.route.params.item.pdfHeight *
          this.props.route.params.item.numPages *
          Dimensions.get('window').width) /
        this.props.route.params.item.pdfWidth,
    };

    // console.log('Props:', this.props);
    // console.log('Item: ', item);
    // console.log('Item url: ', item.url);
    // console.log('props.route: ', this.props.route);
    console.log('props.route.params: ', this.props.route.params);
    console.log('props.route.params.item: ', this.props.route.params.item.url);

    this.scrollIndex = 0;

    sampleCommentsRaw.forEach(c => {
      if (c.children) {
        c.childrenCount = c.children.length;
      }
    });
    this.sampleComments = Object.freeze(sampleCommentsRaw);

    console.log('Rendering comments with data:', this.state.comments);

    console.log('this.state.itemPdfHeight: ', this.state.itemPdfHeight);
    console.log('this.state.itemPdfWidth: ', this.state.itemPdfWidth);
    console.log('this.state.itemNumPages: ', this.state.itemNumPages);
    console.log('this.state.title: ', this.state.title);
    console.log('this.state.author: ', this.state.author);
    console.log('this.state.category: ', this.state.category);
    console.log('this.state.date: ', this.state.date);
    console.log('this.state.itemImage: ', this.state.itemImage);
    console.log('this.state.source: ', this.state.source);

    console.log(
      'pdf height willl be = ',
      (this.state.itemPdfHeight *
        this.state.itemNumPages *
        Dimensions.get('window').width) /
        this.state.itemPdfWidth,
    );
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static navigatorStyle = {};

  componentWillMount() {
    const c = this.actions.getComments();
    this.setState({
      comments: c,
      loadingComments: false,
      lastCommentUpdate: new Date().getTime(),
    });
  }

  extractUsername(c) {
    try {
      return c.email !== '' ? c.email : null;
    } catch (e) {
      console.log(e);
    }
  }

  extractBody(c) {
    try {
      return c.body && c.body !== '' ? c.body : null;
    } catch (e) {
      console.log(e);
    }
  }

  extractImage(c) {
    try {
      return c.image_id && c.user.image_id !== '' ? c.user.image_id : '';
    } catch (e) {
      console.log(e);
    }
  }

  extractChildrenCount(c) {
    try {
      return c.childrenCount || 0;
    } catch (e) {
      console.log(e);
    }
  }

  extractEditTime(item) {
    try {
      return item.updated_at;
    } catch (e) {
      console.log(e);
    }
  }

  extractCreatedTime(item) {
    try {
      return item.created_at;
    } catch (e) {
      console.log(e);
    }
  }

  likeExtractor(item) {
    return item.liked;
  }

  reportedExtractor(item) {
    return item.reported;
  }

  likesExtractor(item) {
    return item.likes.map(like => {
      return {
        image: like.image,
        name: like.username,
        user_id: like.user_id,
        tap: username => {
          console.log('Taped: ' + username);
        },
      };
    });
  }

  isCommentChild(item) {
    return item.parentId !== null;
  }

  render() {
    const review = this.state.review;
    const data = this.state.comments;
    return (
      <View style={styles.container}>
        <View style={globalstyles.topMargin} />
        {/* top bar */}

        <BackButton />

        <ScrollView ref={'scrollView'}>
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
                  },
                ]}>
                {this.state.title}
              </Text>
              <Text
                style={[
                  styles.date,
                  globalstyles.outfit,
                  {fontSize: '3', paddingBottom: 10},
                ]}>
                {this.state.author} • {t(`Community.${this.state.category}`)} •{' '}
                {this.state.date}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              height: 150,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}>
            <Image
              source={{uri: this.state.itemImage}}
              style={{width: '100%', height: '100%', resizeMode: 'center'}}
            />
          </View>

          {/* pdf render */}

          <View style={styles.pdfcontainer} pointerEvents={'none'}>
            <Pdf
              source={this.state.source}
              onLoadComplete={(numberOfPages, filePath, {width, height}) => {
                console.log(
                  `Number of pages: ${numberOfPages}\n width = ${width} \n height = ${height} \n containerHeight = ${
                    (this.state.itemPdfHeight *
                      this.state.itemNumPages *
                      Dimensions.get('window').width) /
                    this.state.itemPdfWidth
                  }`,
                );
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
                console.log('cant load pdf, ', error);
              }}
              onPressLink={uri => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={{
                height: Number(
                  (this.state.itemPdfHeight *
                    this.state.itemNumPages *
                    Dimensions.get('window').width) /
                    this.state.itemPdfWidth,
                ),
                width: '100%',
              }}
            />
          </View>

          {/* <View style={[styles.hstack, {paddingBottom: 45}]}>
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
                  },
                ]}>
                Comments
              </Text>
              <View style={{flex: 1}}>
                {this.state.comments.length ? (
                  <Comments
                    data={data}
                    //To compare is user the owner
                    viewingUserName={'Pearline@veda.ca'}
                    // is the current user an admin
                    userIsAdmin={true}
                    // Styles to pass. Search for getStyles to find out what can be overwritten
                    styles={{}}
                    //how many comments to display on init
                    initialDisplayCount={5}
                    //How many minutes to pass before locking for editing
                    editMinuteLimit={0}
                    //What happens when user taps on username or photo
                    // usernameTapAction={username => {
                    //   console.log('Taped user: ' + username);
                    // }}
                    //Where can we find the children within item.
                    //Children must be prepared before for pagination sake
                    childPropName={'children'}
                    isChild={item => this.isCommentChild(item)}
                    //We use this for key prop on flat list (i.e. its comment_id)
                    keyExtractor={item => item.commentId}
                    //Extract the key indicating comments parent
                    parentIdExtractor={item => item.parentId}
                    //what prop holds the comment owners username
                    usernameExtractor={item => this.extractUsername(item)}
                    //when was the comment last time edited
                    editTimeExtractor={item => this.extractEditTime(item)}
                    //When was the comment created
                    createdTimeExtractor={item => this.extractCreatedTime(item)}
                    //where is the body
                    bodyExtractor={item => this.extractBody(item)}
                    //where is the user image
                    imageExtractor={item => this.extractImage(item)}
                    //Where to look to see if user liked comment
                    likeExtractor={item => this.likeExtractor(item)}
                    //Where to look to see if user reported comment
                    reportedExtractor={item => this.reportedExtractor(item)}
                    //Where to find array with user likes
                    likesExtractor={item => this.likesExtractor(item)}
                    //Where to get nr of replies
                    childrenCountExtractor={item =>
                      this.extractChildrenCount(item)
                    }
                    //what to do when user clicks reply. Usually its header height + position (b/c scroll list heights are relative)
                    replyAction={offset => {
                      this.refs.scrollView.scrollTo({
                        x: null,
                        y:
                          this.scrollIndex +
                          offset -
                          300 +
                          this.state.entirePdfHeight,
                        animated: true,
                      });
                    }}
                    //what to do when user clicks submits edited comment
                    saveAction={(text, parentCommentId) => {
                      let date = moment().format('YYYY-MM-DD H:mm:ss');
                      let comments = this.actions.save(
                        this.state.comments,
                        text,
                        parentCommentId,
                        date,
                        'testUser',
                      );
                      this.setState({
                        comments: comments,
                      });

                      if (!parentCommentId) {
                        this.refs.scrollView.scrollToEnd();
                      }
                    }}
                    //what to do when user clicks submits edited comment
                    editAction={(text, comment) => {
                      let comments = this.actions.edit(
                        this.state.comments,
                        comment,
                        text,
                      );
                      this.setState({
                        comments: comments,
                      });
                    }}
                    //what to do when user clicks report submit
                    reportAction={comment => {
                      let comments = this.actions.report(
                        this.state.comments,
                        comment,
                      );
                      this.setState({
                        comments: comments,
                      });
                    }}
                    //what to do when user clicks like
                    likeAction={comment => {
                      let comments = this.actions.like(
                        this.state.comments,
                        comment,
                      );
                      this.setState({
                        comments: comments,
                      });
                    }}
                    //what to do when user clicks like
                    deleteAction={comment => {
                      let comments = this.actions.deleteComment(
                        this.state.comments,
                        comment,
                      );
                      this.setState({
                        comments: comments,
                      });
                    }}
                    //Must return promise
                    paginateAction={(
                      from_comment_id,
                      direction,
                      parent_comment_id,
                    ) => {
                      //Must return array of new comments after pagination

                      let newComments = this.actions.paginateComments(
                        this.state.comments,
                        from_comment_id,
                        direction,
                        parent_comment_id,
                      );

                      this.setState({
                        comments: newComments,
                      });
                      let self = this;
                      setTimeout(function () {
                        if (direction == 'up') {
                          self.refs.scrollView.scrollTo({
                            x: 0,
                            y: 500,
                            animated: true,
                          });
                        } else {
                          self.refs.scrollView.scrollTo({
                            x: 0,
                            y: 0,
                            animated: true,
                          });
                        }
                      }, 3000);
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    padding: 5,
    flexDirection: 'row',
  },
  left: {
    padding: 5,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  right: {
    flex: 1,
    padding: 5,
  },
  rightContent: {
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#f1f3f6',
  },
  rightContentTop: {
    flexDirection: 'row',
  },

  name: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  editIcon: {
    flex: 1,
    alignItems: 'flex-end',
  },
  body: {
    paddingBottom: 10,
  },
  rightActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    paddingLeft: 5,
    color: '#9B9B9B',
    fontStyle: 'italic',
  },
  actionText: {
    color: '#9B9B9B',
    fontWeight: 'bold',
  },
  repliedSection: {
    width: 180,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  repliedImg: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  repliedUsername: {
    color: '#9B9B9B',
    fontWeight: 'bold',
  },
  repliedText: {
    color: '#9B9B9B',
  },
  repliedCount: {
    color: '#9B9B9B',
    fontSize: 12,
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  submit: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    color: '#424242',
  },
  likeNr: {
    fontWeight: 'normal',
    fontSize: 12,
  },
  likeHeader: {
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
  likeButton: {
    margin: 10,
    alignItems: 'center',
  },
  likeContainer: {
    padding: 10,
    width: 200,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  likeImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  likename: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  editModalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModal: {
    backgroundColor: 'white',
    width: 400,
    height: 300,
    borderWidth: 2,
    borderColor: 'silver',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    width: 80,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'silver',
    borderRadius: 5,
    margin: 10,
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
    marginBottom: 15,
  },
});
