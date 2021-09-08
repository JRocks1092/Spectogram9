import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import IonIcons from 'react-native-vector-icons/Ionicons';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      data: '',
      lightTheme:false
    }
  }
  componentDidMount() {
    this.setData();
  }
  setData() {
    this.setState({ data: this.props.route.params.data, lightTheme:this.props.route.params.lightTheme })
  }
  render() { 
    return (
      <View style={this.state.lightTheme ?styles.container:styles.containerDark}>
        <Text style={this.state.lightTheme ?styles.heading:styles.headingDark}>{this.state.data.authorName}</Text>
        <Image source={require('../assets/image_3.jpg')} style={styles.image} />
        <Text style={this.state.lightTheme ?styles.text:styles.textDark}>{this.state.data.caption}</Text>
        <TouchableOpacity style={styles.touchableOpacity}>
          <IonIcons name={"heart"} color={"white"} size={RFValue(30)}>
            <Text>12K</Text>
          </IonIcons>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },

  touchableOpacity: {
    borderRadius: 20,
    backgroundColor: 'red',
    width: 200,
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  heading: {
    color: '#000',
    alignSelf: 'center',
    fontSize: 40,
  },

  headingDark: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 40,
  },

  textInput: {
    borderWidth: 3,
    borderRadius: 20,
    width: 200,
    marginTop: 50,
    alignSelf: 'center',
    textAlign: 'center',
  },

  bg: {
    flex: 1,
    resizeMode: 'cover',
  },

  image: {
    width: 300,
    height: 200,
    alignSelf: 'center',
  },

  text: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },

  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },

  containerDark: {
    backgroundColor: '#000',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  textDark: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },

});
