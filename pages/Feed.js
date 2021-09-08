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
  FlatList,
  ScrollView
} from 'react-native'; 
import { RFValue } from 'react-native-responsive-fontsize';

import PostCard from '../components/PostCard';

import firebase from 'firebase';

const data = require('../trmpdata.json');

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      lightTheme: false,
      posts: []
    }
  }
 
  componentDidMount() {   
    this.fetchUser();
  }

  async fetchUser() {  
    let theme;
    var username = firebase.auth().currentUser.uid;
    await firebase.database().ref('/users/' + username).on("value", function (snapshot) {
      theme = snapshot.val().current_theme; 
    });
    this.setState({
      lightTheme: theme === "light" ? true : false,
    });

    this.fectData();
  }
 
  async fectData() {  
    var allData = [];     
    var scoresRef = await firebase.database().ref("/post");  
    scoresRef.on("value", function (snapshot)  {            
      snapshot.forEach(function (data) {        
        allData.push(data);
      }); 
    });      
    this.setState({ posts: allData }); 
  }

  renderItems = (data) => {    
    return (
      <PostCard lightTheme={this.state.lightTheme} cardData={data.item} navigation={this.props.navigation} />
    );
  }

  ItemSeparator = () => (
    <View
      style={{
        height: 10,
        marginLeft: 10,
        marginRight: 10,
      }}
    />
  );

  render() {
    return (
      <View style={this.state.lightTheme ? styles.container : styles.constainerDark}>
        <ScrollView>
          <View style={{ backgroundColor: 'black', width: 110, borderRadius: 50, alignSelf: 'center', height: 110, marginBottom: 15, marginTop: 15, justifyContent: 'center' }}>
            <Image style={styles.image} source={require('../assets/logo.png')} />
          </View>

          <FlatList
            keyExtractor={(item) => item.author}
            data={this.state.posts}
            renderItem={(item) => this.renderItems(item)}
            ItemSeparatorComponent={this.ItemSeparator}
          />
          <Text style={{ marginTop: 20 }}></Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  constainerDark: {
    backgroundColor: '#000000',
    flex: 1
  },

  image: {
    width: 100,
    height: 100,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  }
});
