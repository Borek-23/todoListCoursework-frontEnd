// Modal is where I can have a pop-up window in which I can type
import React, {Component} from 'react';
import {
    AppRegistry, FlatList, StyleSheet, Text, View,
    Image, Alert, Platform, TouchableHighlight,
    Dimensions, TextInput
} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
import {insertTasksToServer} from "../networking/Server";

let screen = Dimensions.get('window');

export default class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTaskListName: '',
            newTaskListDescription: '',
            newTasks: ''
        }
    }

    showAddModal = () => {
        this.refs.myModal.open();
    };

    render() {
        return (
            <Modal
                ref={"myModal"}
                style={{
                    justifyContent: 'center',
                    borderRadius: Platform.OS === 'android' ? 0 : 30,
                    shadowRadius: 10,
                    width: screen.width - 80,
                    height: 350
                }}
                position='center'
                backdrop={true}
                onClosed={() => {
                    // alert("Modal Closed");
                }}
            >

                {/* Title for the Modal */}
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10
                }} >Adding a Task List</Text>

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
                    onChangeText={(text) => this.setState({newTaskListName: text})}
                    placeholder="Enter a new Task List name"
                    value={this.state.newTaskListName}
                />

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
                    onChangeText={(text) => this.setState({newTaskListDescription: text})}
                    placeholder="Enter a new Task List description"
                    value={this.state.newTaskListDescription}
                />

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
                    onChangeText={(text) => this.setState({newTasks: text})}
                    placeholder="Enter new Task(s) separated by Spaces"
                    value={this.state.newTasks} // this.state.newTasks
                />

                <Button
                    style={{fontSize: 18, color: 'white'}}
                    containerStyle={{
                        padding: 8,
                        marginTop: 10,
                        marginLeft: 70,
                        marginRight: 70,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: 'mediumseagreen'
                    }}
                    onPress={() => {
                        if ((this.state.newTaskListName.length === 0 || this.state.newTasks.length === 0)
                            && (!this.state.newTaskListDescription.length === 0 || (this.state.newTaskListName.length === 0 || this.state.newTasks.length === 0))) {
                            alert("New Task List has to have at least a Name and one or more Tasks");
                            return;
                        }
                        const newTaskList = {
                            name: this.state.newTaskListName,
                            description: this.state.newTaskListDescription,
                            tasks: this.state.newTasks.split(","),
                        };
                        insertTasksToServer(newTaskList).then(() => {
                            this.props.parentFlatList.refreshDataFromServer();
                        });
                        this.refs.myModal.close();
                    }}
                >
                    Save List
                </Button>
            </Modal>
        )
    }
}







