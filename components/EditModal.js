// Modal is where I can have a pop-up window in which I can type
import React, {Component} from 'react';
import {
    AppRegistry, FlatList, StyleSheet, Text, View,
    Image, Alert, Platform, TouchableHighlight,
    Dimensions, TextInput
} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
import {apiUpdateTaskLists, updateTaskLists} from "../networking/Server";


let screen = Dimensions.get('window');


export default class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskListName: '',
            taskListDescription: '',
            tasks: ''
        }
    }

    showEditModal = (editingTasks, flatListItem) => {
        // console.log(`editingFood = ${JSON.stringify(editingTasks)}`);
        this.setState({
            // key: editingTasks.key,
            key: editingTasks._id,
            taskListName: editingTasks.name,
            taskListDescription: editingTasks.description,
            tasks: editingTasks.tasks,
            flatListItem: flatListItem
        });
        this.refs.myModal.open();
    };

    // generateKey = (numberOfCharacters) => {
    //     return require('random-string')({numberOfCharacters});
    // };

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
                }} >Editing a Task List</Text>

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
                    onChangeText={(text) => this.setState({taskListName: text})}
                    placeholder="Enter a Task List name"
                    value={this.state.taskListName}
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
                    onChangeText={(text) => this.setState({taskListDescription: text})}
                    placeholder="Enter a Task List description"
                    value={this.state.taskListDescription}
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
                    onChangeText={(text) => this.setState({tasks: text})}
                    placeholder="Edit Task(s)"
                    value={this.state.tasks.toString()}
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
                        if ((this.state.taskListName.length === 0 || this.state.tasks.length === 0)
                            && (!this.state.taskListDescription.length === 0 || (this.state.taskListName.length === 0 || this.state.tasks.length === 0))) {
                            alert("New Task List has to have at least a Name and one or more Tasks");
                            return;
                        }
                        let params = {
                            taskListId: this.state.key,
                            name: this.state.taskListName,
                            description: this.state.taskListDescription,
                            tasks: this.state.tasks,
                        };
                        // Update existing Tasks Lists
                        updateTaskLists(params).then(() => {
                            // console.log(`this.state.flatlistItem = ${this.state.flatlistItem}`);
                            this.state.flatlistItem.refreshFlatListItem({
                                _id: this.state.key,
                                name: this.state.taskListName,
                                listDescription: this.state.taskListDescription,
                                listTasks: this.state.tasks,
                            });
                            this.refs.myModal.close();
                        }).catch((error) => {
                            console.log(`error = ${error}`);
                            this.refs.myModal.close();
                        });
                        // Refresh flatList item
                        // this.state.flatListItem.refreshFlatListItem();
                        // this.refs.myModal.close();
                    }}
                >
                    Save List
                </Button>
            </Modal>
        )
    }
}


// var foundIndex = flatListData.findIndex(item => this.state.key === item.key);
// if (foundIndex < 0) {
//     return;
// }
// flatListData[foundIndex].name = this.state.taskListName;
// flatListData[foundIndex].description = this.state.taskListDescription;
// flatListData[foundIndex].tasks = this.state.tasks;



