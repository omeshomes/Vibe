import 'expo';
import React from 'react';
import { StyleSheet,
        Text,
        View,
        TouchableOpacity,
        Platform,
        Image,
        StatusBar,
        Button,
        Linking
        } from 'react-native';
import { Icon } from 'react-native-elements';
import { ImagePicker } from 'expo';
import { StackNavigator } from 'react-navigation';

// import vision from "node-cloud-vision-api";
// vision.init({ auth: 'AIzaSyCHn4oIcmIftU7mEaWtNOXLM7G02wCxOhU'})
// console.log('worked');
// google.auth.getApplicationDefault(function(err, authClient) {
//     if (err) {
//       return cb(err);
//     }});

// import Axios from 'axios';

let IMAGE = null;

class SongPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSong: {},
      isPlaying: false,
      image: IMAGE
    };

    this.getSong = this._getSong.bind(this);
    this.playSong = this._playSong.bind(this);
    this.pauseSong = this._pauseSong.bind(this);
  }

  /* BUG CHANGE LATER TO NOT HARD CODE THIS FUNC CALL BUG */
  componentDidMount() {
    this.getSong();
  }
  /* BUG CHANGE LATER TO NOT HARD CODE ABOVE FUNC CALL BUG */

  _getSong() {
    console.log("getting song");


    /* BUG CHANGE LATER TO NOT HARD CODE THESE VARS BUG */
    const title = 'On Top of the World';
    const artist = 'Imagine Dragons';
    /* BUG CHANGE LATER TO NOT HARD CODE ABOVE VARS BUG */

    this.setState({song: { title , artist }})
  }

  _playSong() {
    console.log("playing song!");
    Linking.openURL('https://open.spotify.com/album/3cyyJALrHc8LawnQNFYRWL')
    .catch(err => console.error('An error occurred', err));

  }

  _pauseSong() {
    console.log("pausing song!");

  }

  render() {
    return (
      <View style={styles.container}>
        <MyStatusBar backgroundColor="black" barStyle="light-content" />
        {/* image picker and camera  */}
        <View style={styles.imagecontainer}>

          {this.state.image &&
            <Image source={{ uri: IMAGE }} style={{ width: 200, height: 200 }} />}
        </View>
        {/* song title and info  */}
        <View style={styles.textcontainer}>
          <Text style={styles.textTitle}> {(this.state.song && this.state.song.title) || ''} </Text>
          <Text style={styles.textArtist}> by {(this.state.song && this.state.song.artist) || ''} </Text>
        </View>
        {/* song play/pause buttons  */}
        <View style={styles.btncontainer}>
          <TouchableOpacity
            id="playbtn"
            onPress={() => this.playSong()}
            style={styles.btn}>
              <Icon
                reverse
                name='play-arrow'
                color='rgb(97, 99, 104)'
                size={15}
              />
          </TouchableOpacity>
          <TouchableOpacity
            id="pausebtn"
            onPress={() => this.pauseSong()}
            style={styles.btn}>
              <Icon
                reverse
                name='pause'
                color='rgb(97, 99, 104)'
                size={15}
              />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class PicPicker extends React.Component {
  constructor(props) {
    super(props);
    this.pickImage = this._pickImage.bind(this);
  }

  static navigationOptions = {
    title: 'PicPicker',
  }

  _pickImage = async () => {
    let result;

    try {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      // this.setState({ image: result.uri });
      IMAGE = result.uri;

      // // Performs label detection on the image file
      // console.log('a');
      // const req = new vision.Request({
      //   image: new vision.Image(result.uri),
      //   features: [
      //     new vision.Feature('LABEL_DETECTION', 10),
      //   ]
      // })

      // console.log('b', req);

      // vision.annotate(req).then((res) => {
      //   // handling response
      //   console.log('hello');
      //   console.log(JSON.stringify(res.responses))
      // }).catch((err) => {
      //   console.log('Error: ', err);
      // })

      // // vision.labelDetection(request)
      // //   .then((results) => {
      // //     const labels = results[0].labelAnnotations;

      // //     console.log('Labels:');
      // //     labels.forEach((label) => console.log(label.description));
      // //   })
      // //   .catch((err) => {
      // //     console.error('ERROR:', err);
      // //   });

      // console.log('c');

      this.props.navigation.navigate('SongPlayer');
    } catch (err) {
      console.log('could not load pic: ', err);

    }

    console.log('result', result);
  };

  render () {
    return (
      <View style={styles.container}>
         <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
    )
  }

}

export default StackNavigator({
  PicPicker: {
    screen: PicPicker,
  },
  SongPlayer: {
    screen: SongPlayer,
  },
}, {initialRouteName: 'PicPicker'});

// LOCAL COMPONENTS AND styles

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textcontainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'scroll',
    marginBottom: '5%',
  },
  text: {
    color: 'grey',
  },
  textTitle: {
    color: 'grey',
    fontSize: 25,
  },
  textArtist: {
    color: 'grey',
    fontSize: 15
  },
  btncontainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

    // padding: '2%',
    margin: '1%',

    borderRadius: 45,
    backgroundColor: '#9199a5',
  },
  btnimg: {
    height: 35,
    width: 35
  },
  playtext: {
    color: 'red'
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  imagecontainer: {
    margin: '2%',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }, 

});
