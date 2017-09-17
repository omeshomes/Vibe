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
        WebView } from 'react-native';
import { Icon } from 'react-native-elements';
import { ImagePicker } from 'expo';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import qs from 'querystring';
import Iframe from 'react-iframe';

import vision from "react-cloud-vision-api";
vision.init({ auth: 'Basic AIzaSyCHn4oIcmIftU7mEaWtNOXLM7G02wCxOhU'})
console.log('worked');

let IMAGE = null;

class SongPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSong: {},
      isPlaying: false,
      image: IMAGE,

      keyword: '',
      playlistUri: '',
      interval: {},

      time: 5,

      spotify_token: 'Bearer BQCCsslW6gFO8rHDLeFD-6yjD3IIOEh9bjMgkWiEumu98bcjehpYZVANN5czEiB7DU5d1k-svGdn1lwIlgv9Eg',
      spotify_client_id: 'MGIxMWJmMWRkY2FmNGJiNmI5MzY4ODFjZDViYzAzNGI6NmM1YTIwNTE3M2QwNDFjZjkwZTdhNTA1NTc3MzNkNGM'
    };

    // this.getSong = this._getSong.bind(this);
    this.getUpdatedSpotifyToken = this._getUpdatedSpotifyToken.bind(this);
    this.getPlaylists = this._getPlaylists.bind(this);
    this.getKeywords = this._getKeywords.bind(this);
    this.redirectToSpotify = this._redirectToSpotify.bind(this);
  }

  static navigationOptions = {
    title: 'Playlist',
  }

  componentDidMount() {
    this.getKeywords();

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


  _getKeywords() {
    const self = this;
    const file = this.state.image.replace("file://", "");
    console.log('in get keywords', this.state.image, 'FILE', file);
    axios.post('http://127.0.0.1:5000/', {data: this.state.image})
    .then((res) => {
      console.log('**** **** **** **** **** ****');
      console.log('response', res.data);
      console.log('**** **** **** **** **** ****');

    }).catch((e) => {
      console.log('ERROR: ', e);
      // if file not work, send in this default pic
      return axios.post('http://127.0.0.1:5000/', {data: 'pic1.jpg'})
      .then(res => {
        console.log('**** **** **** **** **** ****');
        console.log('response', res.data);
        console.log('**** **** **** **** **** ****');

        // now set state with descrip and redirect to get playlists
        const descrip = res.data.substring(0, res.data.indexOf(":")-1).split(" ");
        self.setState({googleDescrip: descrip});
        const genre = res.data.substring(res.data.indexOf(':') + 2);
        self.setState({keyword: genre});

        console.log('end of get keywords', res.data.indexOf(':'),' set state,', self.state.keyword, 'DESCRIP ', self.state.googleDescrip);
        this.getPlaylists();
      })
    })
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
      console.log('GET REQUEST WENT THROUGH!!', resp.data.playlists.items[2]);
      const defaultPlaylistUri = 'spotify:user:spotify:playlist:37i9dQZF1DXcF6B6QPhFDv';
      const playlist = (resp.data && resp.data.playlists && resp.data.playlists.items) ?
        resp.data.playlists.items[2] : null;

      let playlistUri = 'http://open.spotify.com/embed?uri=';
      playlistUri += playlist ? playlist.external_urls.spotify : defaultPlaylistUri;

      self.setState({playlistUri});
      console.log('set state of playlistUri', self.state.playlistUri);

      // now redirect to spotify
      this.redirectToSpotify();
    })
    .catch(err => {
      console.log('err, get not go thru ... ', err);
    })
  }

  _redirectToSpotify () {
    console.log('in redirect to spotify');
    const self = this;
    setTimeout(() => {
      console.log("redirecting...");
      Linking.openURL(self.state.playlistUri)
      // https://open.spotify.com/album/3cyyJALrHc8LawnQNFYRWL
      .catch(err => console.error('An error occurred', err));
    }, 5000);
  }

  render() {
    const source = {uri: this.state.playlistUri};
    const htmlText = "<iframe id='spotify_embed' src={uri: 'http://open.spotify.com/embed?uri=spotify:user:spotify:playlist:37i9dQZF1DXcF6B6QPhFDv'}> </iframe>";
    const html2 = "<p>hello!</p>";

    let time = 5;
    if (this.state.googleDescrip) {
      setInterval(() => {
        while (this.state.time > 0) {
          this.setState({time: this.state.time - 1});
        }
      })
    }

    return (
      <View style={styles.container}>
        <MyStatusBar backgroundColor="black" barStyle="light-content" />

        {/* song title and info  */}
        <View style={styles.textcontainer}>
          <Text style={styles.textArtist}> Detected:
            {this.state.googleDescrip && this.state.googleDescrip.map((word, i) => {
                return i!=2 ? ' '+ word + ',' : ' '+word ;
              }) }
          </Text>
          <Text style={styles.textArtist}> queueing up: {this.state.keyword || ''} playlist </Text>
        </View>
        {/* image picker and camera  */}
        <View style={styles.imagecontainer}>
          {this.state.image &&
            <Image source={{ uri: IMAGE }} style={{ width: 200, height: 200 }} />}
        </View>
        {/* song title and info  */}
        <View style={styles.textcontainer}>
          <Text style={styles.textqueue}>
            redirecting in {time} sec ...
          </Text>
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
    title: 'Vibe',
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

      console.log('set image', result.uri);

      this.props.navigation.navigate('Playlist');
    } catch (err) {
      console.log('could not load pic: ', err);

    }

    console.log('result', result);
  };

  render () {
    return (
      <View style={styles.container}>
         <Button
          title="Choose an image..."
          onPress={this._pickImage}
        />
      </View>
    )
  }
}

export default StackNavigator({
  Vibe: {
    screen: PicPicker,
  },
  Playlist: {
    screen: SongPlayer,
  },
}, {initialRouteName: 'Vibe'});

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
  queuetext: {
    color: 'grey',
    fontSize: 18,
    margin: '2%'
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
    margin: '5%',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

});



/* BUG CHANGE LATER TO NOT HARD CODE ABOVE FUNC CALL BUG */

// _getSong() {
//   console.log("getting song");
//
//   /* BUG CHANGE LATER TO NOT HARD CODE THESE VARS BUG */
//   const title = 'On Top of the World';
//   const artist = 'Imagine Dragons';
//   /* BUG CHANGE LATER TO NOT HARD CODE ABOVE VARS BUG */
//
//   this.setState({song: { title , artist }})
// }
// Performs label detection on the image file
// console.log('a');
// const req = new vision.Request({
//   image: new vision.Image({
//     base64: result.uri
//   }),
//   features: [
//     new vision.Feature('TEXT_DETECTION', 4),
//     new vision.Feature('LABEL_DETECTION', 10),
//   ]
// })
//
// console.log('b', req);
//
// vision.annotate(req).then((res) => {
//   // handling response
//   console.log('hello');
//   console.log(JSON.stringify(res.responses))
// }, (e) => {
//   console.log('Error: ', e)
// })
//
// // vision.labelDetection(request)
// //   .then((results) => {
// //     const labels = results[0].labelAnnotations;
//
// //     console.log('Labels:');
// //     labels.forEach((label) => console.log(label.description));
// //   })
// //   .catch((err) => {
// //     console.error('ERROR:', err);
// //   });
//
// console.log('c');

/* {/* song play/pause buttons }
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
*/
