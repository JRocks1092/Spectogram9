import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostScreen from '../pages/PostScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default class App extends Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen component={TabNavigator} name="TabNavigator" options = {{ headerShown:false }}/>
                <Stack.Screen component={PostScreen} name="PostScreen" options={{ headerTitle: 'Post' }} />
            </Stack.Navigator>
        );
    }
}