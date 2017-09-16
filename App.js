import React from 'react';
import { StyleSheet,
        Text,
        View,
        TouchableOpacity,
        Platform,
        Image,
        StatusBar,
        ImagePicker} from 'react-native';
import { Icon } from 'react-native-elements';
import Axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSong: {},
      isPlaying: false
    };

    this.getSong = this.getSong.bind(this);
    this.playSong = this.playSong.bind(this);
    this.pauseSong = this.pauseSong.bind(this);
  }

  /* BUG CHANGE LATER TO NOT HARD CODE THIS FUNC CALL BUG */
  componentDidMount() {
    this.getSong();
  }
  /* BUG CHANGE LATER TO NOT HARD CODE ABOVE FUNC CALL BUG */

  getS
  ong() {
    console.log("getting song");

    /* BUG CHANGE LATER TO NOT HARD CODE THESE VARS BUG */
    const title = 'On Top of the World';
    const artist = 'Imagine Dragons';
    /* BUG CHANGE LATER TO NOT HARD CODE ABOVE VARS BUG */

    this.setState({song: { title , artist }})
  }

  playSong() {
    console.log("playing song!");

  }

  pauseSong() {
    console.log("pausing song!");
  }

  render() {
    return (
      <View style={styles.container}>
        <MyStatusBar backgroundColor="black" barStyle="light-content" />

        <View style={styles.textcontainer}>
          <Text style={styles.text}> {(this.state.song && this.state.song.title) || ''} </Text>
          <Text style={styles.text}> by {(this.state.song && this.state.song.artist) || ''} </Text>
        </View>
        <View style={styles.btncontainer}>
          <TouchableOpacity
            id="playbtn"
            onPress={() => this.playSong()}
            style={styles.btn}>
              {/* <Text style={styles.playtext}>Play</Text> */}
              {/* <Image
                style={styles.btnimg}
                source={require('./pics/play.png')}
              /> */}
              <Icon
                reverse
                name='play-arrow'
                color='grey'
                size={15}
              />
          </TouchableOpacity>
          <TouchableOpacity
            id="pausebtn"
            onPress={() => this.pauseSong()}
            style={styles.btn}>
              {/* <Text style=/{styles.playtext}>Pause</Text> */}
              {/* <Image
                style={styles.btnimg}
                source={require('./pics/pause.png')}
              /> */}
              <Icon
                reverse
                name='pause'
                color='rgb(0,0,0)'
                size={15}
              />
          </TouchableOpacity>
        </View>




      </View>
    );
  }
}

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
    overflow: 'scroll',
    marginBottom: '5%',
  },
  text: {
    color: 'grey',
  },
  textTitle: {
    fontSize: 25,
  },
  textArtist: {
    fontSize: 20
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
});
