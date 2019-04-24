import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {AsyncStorage} from 'react-native';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quickNote: ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome to React Native!</Text>
                <Button title={'Make a Quick Note'} onPress={this._storeData}/>
                <Button title={'Reveal your Quick Note'} onPress={this._storeData}/>

                <View >
                    <Button title={'Go to your To-Do Lists'} onPress={this._storeData}/>
                </View>
            </View>
        );
    }

    // Persistent storage using AsyncStorage component
    _storeData = async () => {
        try {
            await AsyncStorage.setItem('quickNote', {note: this.setState(this.state.quickNote)});
            alert('Note Saved');
        } catch (error) {
            console.error(error);
        }
    };

    // Retrieve data from persistent storage
    _retrieveData = async () => {
        try {
            const note = await
        } catch (error) {
            console.error(error);
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});