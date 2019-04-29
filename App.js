import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {AsyncStorage} from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

// Importing Native toast module from java files
import { NativeModules } from 'react-native'
import BasicFlatList from "./components/BasicFlatList";
const {ToastModule} = NativeModules;

/**
 * Default class export, this is the component
 * */
class App extends Component { // export default
    // Declaring constructor to initialise the state props
    constructor(props) {
        super(props);
        this.state = {
            quickNote: '',
            showNote: ''
        }
    }

    // Rendering on screen
    render() {
        return (
            // Root View component
            <View style={styles.container}>
                {/* Components heading */}
                <Text style={styles.mainHeading}>To-Do List Manager</Text>

                <View style={{
                    flex: 1,
                    justifyContent: 'space-around'
                }}>
                    {/* User input */}
                    <TextInput
                        style={{
                            height: 40,
                            borderBottomColor: 'gray',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 20,
                            marginBottom: 10,
                            borderBottomWidth: 1
                        }}
                        // This is function called when a user types in text
                        onChangeText={(text) => this.setState({quickNote: text})}
                        // This will disappear when user starts typing
                        placeholder="Take a Quick Note"
                        // Assign the input value to a state
                        value={this.state.quickNote}
                    />

                    {/* Button to save notes, calls _storeData method */}
                    <Button style={styles.button} title={'Save your Note'} onPress={this._storeData}/>

                    {/* Button to save notes, calls _retrieveData method */}
                    <Button style={styles.button} title={'Reveal your Note'} onPress={this._retrieveData}/>

                    {/* Displays the note when reveal note button pushed */}
                    <Text style={{justifyContent: 'space-evenly'}}>Your Note: {this.state.showNote}</Text>
                </View>

                {/* Will navigate to To-Do lists screen */}
                <View style={styles.container}>
                    <Button
                        title={'Go to your To-Do Lists'}
                        onPress={() => {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'Lists' })
                                ],
                            }))
                        }}
                    />
                </View>
            </View>
        );
    }

    // Persistent storage using AsyncStorage component
    _storeData = async () => {
        try {
            await AsyncStorage.setItem('quickNote', `${this.state.quickNote}`);
            // Show Toast message that note was saved
            ToastModule.showText(`Quick Note Saved`, ToastModule.LENGTH_LONG)
        } catch (error) {
            console.error(error);
        }
    };

    // Retrieve data from persistent storage
    _retrieveData = async () => {
        try {
            // Retrieving stored data by calling the key string
            const note = await AsyncStorage.getItem('quickNote');
            if (note !== null) {
                this.setState({showNote: note}) ;
            }
        } catch (error) {
            console.error(error);
        }
    };
}

const AppNavigator = createStackNavigator({
    Home: {
        screen: App,
    },
    Lists: {
        screen: BasicFlatList,
    },
}, {
    initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);

/**
 * Styles Declaration
 * */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        borderWidth: 1,
        padding: 25,
        borderColor: 'black'
    },
    mainHeading: {
        fontSize: 26,
        fontStyle: 'italic',
        color: 'teal',
        textAlign: 'center',
        textShadowColor: '#708090',
        textShadowRadius: 4,
        flexWrap: 'wrap',
        padding: 5
    }
});
