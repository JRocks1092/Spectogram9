import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import * as Google from 'expo-google-app-auth';

import firebase from 'firebase';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';

import AppLoading from 'expo-app-loading';

import * as Font from 'expo-font';

let customfonts = {
  'Roboto_700Bold': require('@expo-google-fonts/roboto/Roboto_100Thin_Italic.ttf'),
  'Roboto_400Regular': require('@expo-google-fonts/roboto/Roboto_400Regular.ttf'),
}

export default class AuthScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false
    }
  }

  async loadFonts() {
    await Font.loadAsync(customfonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            console.log(result.additionalUserInfo.isNewUser);
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref("/users/" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: "dark"
                })
                .then((snapshot) => {
                });
            }
          })
          .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          });
      }
      else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behaviour: 'web',
        androidClientId: "281650545908-hr98ahg4m72eocha4t1ghgqgkf5j9b78.apps.googleusercontent.com",
        iosClientId: "281650545908-2ci8miikk37n1gf9mfchi09j85qtkh3a.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
        this.onSignIn(result);
        this.props.navigation.navigate("DashBoardScreen");
        return result.accessToken;
      }
      else {
        return { cancelled: true };
      }
    }
    catch (e) {
      return { error: true };
    }
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    }
    else {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Spectagram</Text>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
          <TouchableOpacity style={styles.touchableOpacity} onPress={() => this.signInWithGoogleAsync()}>
            <IonIcons style={styles.icon} size= {RFValue(30)} name="logo-google" />
            <View style={styles.itemCont}>
              <Text style={styles.text}>Sign In With Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    position:'relative',
    marginLeft: -140
  },

  logo: {
    width: 100,
    height: 100,
    marginTop: 20
  },

  touchableOpacity: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: 250,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    borderRadius: 50,
  },

  heading: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 40,
    fontFamily: 'Roboto_700Bold',    
  },
  text: {
    color: 'black',
    fontFamily: 'Roboto_400Regular',
    marginLeft: 40
  },
  itemCont: {
    position: 'absolute',
  },
});