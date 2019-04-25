import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {AsyncStorage} from 'react-native';

import { NativeModules } from 'react-native'
const {ToastModule} = NativeModules;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quickNote: '',
            showNote: ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.mainHeading}>To-Do List Manager</Text>

                <View style={{
                    flex: 1,
                    justifyContent: 'space-around'
                }}>
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
                        placeholder="Take a Quick Note"
                        value={this.state.quickNote}
                    />

                    <Button style={styles.button} title={'Save your Note'} onPress={this._storeData}/>

                    <Button style={styles.button} title={'Reveal your Note'} onPress={this._retrieveData}/>

                    <Text style={{justifyContent: 'space-evenly'}}>Your Note: {this.state.showNote}</Text>
                </View>

                <View style={styles.container}>
                    <Button title={'Go to your To-Do Lists'} onPress={() => this.props.BasicFlatList}/>
                </View>
            </View>
        );
    }

    // Persistent storage using AsyncStorage component
    _storeData = async () => {
        try {
            await AsyncStorage.setItem('quickNote', `${this.state.quickNote}`);
            ToastModule.showText(`Quick Note Saved`, ToastModule.LENGTH_LONG)
        } catch (error) {
            console.error(error);
        }
    };

    // Retrieve data from persistent storage
    _retrieveData = async () => {
        try {
            const note = await AsyncStorage.getItem('quickNote');
            if (note !== null) {
                this.setState({showNote: note}) ;
            }
        } catch (error) {
            console.error(error);
        }
    };
}

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
