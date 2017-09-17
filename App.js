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
        Linking,
        WebView
        } from 'react-native';
import { Icon } from 'react-native-elements';
import { ImagePicker } from 'expo';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import qs from 'querystring';
import Iframe from 'react-iframe';




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
      image: IMAGE,

      keyword: 'rock',
      playlistUri: '',
      interval: {},

      spotify_token: 'Bearer BQAKreTY8U0BqwLMgIp_4WO_hMTtmX_1Idz6GPFEg2jjBiCPoYNRVyOB5XWHMte-Eq6ErhncfQK22eAcMzAIQQ',
      spotify_client_id: 'MGIxMWJmMWRkY2FmNGJiNmI5MzY4ODFjZDViYzAzNGI6NmM1YTIwNTE3M2QwNDFjZjkwZTdhNTA1NTc3MzNkNGM'
    };

    this.getSong = this._getSong.bind(this);
    this.playSong = this._playSong.bind(this);
    this.pauseSong = this._pauseSong.bind(this);
    this.getUpdatedSpotifyToken = this._getUpdatedSpotifyToken.bind(this);
    this.getPlaylists = this._getPlaylists.bind(this);
  }

  /* BUG CHANGE LATER TO NOT HARD CODE THIS FUNC CALL BUG */
  componentDidMount() {
    this.getPlaylists();

    console.log('*******************************');
    this.getUpdatedSpotifyToken();
    this.setState({interval: setInterval(() => {
        this.getUpdatedSpotifyToken();
      }, 3600 * 1000)
    });

  }

  _getUpdatedSpotifyToken () {
    const self = this;
    const auth_url = 'https://accounts.spotify.com/api/token';
    console.log('making post request to auth_url', auth_url);

    const data = qs.stringify({ grant_type: 'client_credentials' });

    axios({
      method: 'post',
      url: auth_url,
      headers: {
        'Authorization': this.state.spotify_client_id,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    })
    .then(resp => {
      console.log('POST REQUEST WENT THROUGH!!', resp);
      const newDataToken = resp.token_type + ' ' + resp.access_token;
      self.setState({spotify_token: newDataToken})
    })
    .catch(err => {
      console.log('post req not go through :( ,', err, err.message);
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

  _getPlaylists() {
    const self = this;

    let url = 'https://api.spotify.com/v1/browse/categories/';
    url += self.state.keyword + '/playlists';

    console.log('get request url', url);

    axios({
      method: 'get',
      url,
      dataType: 'json',
      headers: {
        'Authorization': this.state.spotify_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(resp => {
      console.log('GET REQUEST WENT THROUGH!!', resp.data.playlists.items[0]);
      const defaultPlaylistUri = 'spotify:user:spotify:playlist:37i9dQZF1DXcF6B6QPhFDv';
      const playlist = (resp.data && resp.data.playlists && resp.data.playlists.items) ?
        resp.data.playlists.items[0] : null;

      let playlistUri = 'http://open.spotify.com/embed?uri=';
      playlistUri += playlist ? playlist.uri : defaultPlaylistUri;

      self.setState({playlistUri});
      console.log('set state of playlistUri', self.state.playlistUri);

    })
    .catch(err => {
      console.log('err, get not go thru ... ', err);
    })
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
    const source = {uri: this.state.playlistUri};
    const htmlText = "<iframe id='spotify_embed' src={uri: 'http://open.spotify.com/embed?uri=spotify:user:spotify:playlist:37i9dQZF1DXcF6B6QPhFDv'}> </iframe>";
    const html2 = "<p>hello!</p>";

    return (
      <View style={styles.container}>
        <MyStatusBar backgroundColor="black" barStyle="light-content" />

        <TouchableOpacity onPress={() => this.getPlaylists()}>
          <Text style={{color: 'white'}}>test</Text>
        </TouchableOpacity>

        <View>
          {/* {this.state.playlistUri &&
             <WebView html={html2} /*src={{uri: 'http://open.spotify.com/embed?uri=spotify:user:spotify:playlist:37i9dQZF1DXcF6B6QPhFDv'}} height="200" width="200"></WebView>
          */}

          {/* <Iframe url="http://open.spotify.com/embed?uri=spotify:user:spotify:playlist:37i9dQZF1DXcF6B6QPhFDv" width="200" height="200"></Iframe> */}


          {/* <CustomFrame></CustomFrame> */}

        </View>

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
  //
  // componentDidMount() {
  //   axios.get(`http://api.openweathermap.org/data/2.5/weather?q=LasVegas&units=imperial&APPID=89fdd5afd3758c1feb06e06a64c55260`)
  //   .then ( data => {
  //     console.log('axios request worked! ', data);
  //   })
  //
  // }

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
  },

});
