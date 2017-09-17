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
        WebView } from 'react-native';
import { Icon } from 'react-native-elements';
import { ImagePicker } from 'expo';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';

let IMAGE = null;

class SongPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSong: {},
      isPlaying: false,
      image: IMAGE,

      interval: {},

      spotify_token: '',
      spotify_client_id: 'MGIxMWJmMWRkY2FmNGJiNmI5MzY4ODFjZDViYzAzNGI6NmM1YTIwNTE3M2QwNDFjZjkwZTdhNTA1NTc3MzNkNGM'
    };

    this.getSong = this._getSong.bind(this);
    this.playSong = this._playSong.bind(this);
    this.pauseSong = this._pauseSong.bind(this);
    this.getUpdatedSpotifyToken = this._getUpdatedSpotifyToken.bind(this);
  }

  /* BUG CHANGE LATER TO NOT HARD CODE THIS FUNC CALL BUG */
  componentDidMount() {
    this.getSong();

    console.log('*******************************');
    /* url: https://accounts.spotify.com/api/token
    Headers: { Authorization: Basic MGIxMWJmMWRkY2FmNGJiNmI5MzY4ODFjZDViYzAzNGI6NmM1YTIwNTE3M2QwNDFjZjkwZTdhNTA1NTc3MzNkNGM=, Content-Type: application/x-www-form-urlencoded}
    Body: grant_type: client_credentials
    sample response: {
        "access_token": "BQAm6q1inoYkQBFtFXkcx2CVyC3nrqvIm999vPIiQzmolAVktrRaW-Utpp3jDctiSDVkn640Foc_UtbExCljpg",
        "token_type": "Bearer",
        "expires_in": 3600 */
    this.getUpdatedSpotifyToken();

    this.setState({interval: setInterval(() => {
        this.getUpdatedSpotifyToken();
      }, 3600 * 1000)
    });

  }

  _getUpdatedSpotifyToken () {
    const auth_url = 'https://accounts.spotify.com/api/token'+this.state.spotify_client_id;
    console.log('making post request to auth_url', auth_url);
    axios.post(auth_url)
    .then(resp => {
      console.log('POST REQUEST WENT THROUGH!!', resp);
    })
    .catch(err => {
      console.log('post req not go through :( ,', err);
    });
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

  }

  _pauseSong() {
    console.log("pausing song!");

  }

  render() {
    return (
      <View style={styles.container}>
        <MyStatusBar backgroundColor="black" barStyle="light-content" />

        {/* <iframe src="demo_iframe.htm" height="200" width="300"></iframe> */}

        <WebView src="demo_iframe.htm" height="200" width="300"></WebView>

        {/* image picker and camera  */}
        <View style={styles.imagecontainer}>
          {this.state.image &&
            <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
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
  //
  // componentDidMount() {
  //   axios.get(`http://api.openweathermap.org/data/2.5/weather?q=LasVegas&units=imperial&APPID=89fdd5afd3758c1feb06e06a64c55260`)
  //   .then ( data => {
  //     console.log('axios request worked! ', data);
  //   })
  //
  // }

  _pickImage = async () => {
    let result;

    try {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      // this.setState({ image: result.uri });
      IMAGE = result.uri;
    } catch (err) {
      console.log('could not load pic: ', err);

    }

    console.log(result);
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
}, {initialRouteName: 'SongPlayer'});

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
  }
});
