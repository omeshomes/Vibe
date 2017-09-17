import 'expo';
import React from 'react';
import { StyleSheet,
        Text,
        View,
        TouchableOpacity,
        Platform,
        Image,
        StatusBar,
        } from 'react-native';
import { Icon } from 'react-native-elements';
import { ImagePicker } from 'expo';
// import Axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSong: {},
      isPlaying: false,
      image: null
    };

    this.getSong = this._getSong.bind(this);
    this.playSong = this._playSong.bind(this);
    this.pauseSong = this._pauseSong.bind(this);
    this.pickImage = this._pickImage.bind(this);
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

  }

  _pauseSong() {
    console.log("pausing song!");
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <MyStatusBar backgroundColor="black" barStyle="light-content" />
        {/* image picker and camera  */}
        <View style={styles.imagecontainer}>
          <Button
            title="Pick an image from camera roll"
            onPress={this._pickImage}
          />
          {this.state.image &&
            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
        {/* song title and info  */}
        <View style={styles.textcontainer}>
          <Text style={styles.text}> {(this.state.song && this.state.song.title) || ''} </Text>
          <Text style={styles.text}> by {(this.state.song && this.state.song.artist) || ''} </Text>
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
                color='grey'
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
