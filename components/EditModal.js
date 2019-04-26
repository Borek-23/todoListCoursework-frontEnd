// Modal is where I can have a pop-up window in which I can type
import React, {Component} from 'react';
import {
    Text, Platform, Dimensions, TextInput
} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

// Importing updateTaskLists method from Server.js file
import {updateTaskLists} from "../networking/Server";

// Importing Native toast module from java files
import { NativeModules } from 'react-native'
const {ToastModule} = NativeModules;

// Dynamically get the dimensions of the screen to render the modal box window
let screen = Dimensions.get('window');

/**
 * Default class export, this is the component
 * */
export default class EditModal extends Component {
    // Declaring constructor to initialise the state props
    constructor(props) {
        super(props);
        this.state = {
            taskListName: '',
            taskListDescription: '',
            tasks: ''
        }
    }

    // Declaring showEditModal method which takes the list item by id and fetches its details for editing
    showEditModal = (editingTasks, flatListItem) => {
        this.setState({
            key: editingTasks._id,
            taskListName: editingTasks.name,
            taskListDescription: editingTasks.description,
            tasks: editingTasks.tasks,
            flatListItem: flatListItem
        });
        // Opens modal box
        this.refs.myModal.open();
    };

    // Rendering on screen
    render() {
        return (
            // The position and shape of the pop-up modal box - corner radius depending on platform
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
                }}
            >

                {/* Title for the Modal */}
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10
                }} >Editing a Task List</Text>

                {/* Input from the user for editing task list name */}
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
                    // This will disappear when user starts typing
                    placeholder="Enter a Task List name"
                    // Assign the input value to a state
                    value={this.state.taskListName}
                />

                {/* Input from the user for editing task list description */}
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
                    // This will disappear when user starts typing
                    placeholder="Enter a Task List description"
                    // Assign the input value to a state
                    value={this.state.taskListDescription}
                />

                {/* Input from the user for editing tasks */}
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
                    // This will disappear when user starts typing
                    placeholder="Edit Task(s)"
                    // Assign the input value to a state and convert to a string (TextInput only accepts strings)
                    value={this.state.tasks.toString()}
                />

                {/* Save button */}
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
                        // This is a check condition to ensure each task list item has at least one task and a name
                        if ((this.state.taskListName.length === 0 || this.state.tasks.length === 0)
                            && (!this.state.taskListDescription.length === 0 || (this.state.taskListName.length === 0 || this.state.tasks.length === 0))) {
                            alert("New Task List has to have at least a Name and one or more Tasks");
                            return;
                        }
                        // Set the state values for the edited task list
                        let data = {
                            name: this.state.taskListName,
                            description: this.state.taskListDescription,
                            tasks: this.state.tasks.split(","),
                        };
                        // Update existing Tasks Lists
                        updateTaskLists(this.state.key, data).then(() => {
                            // Call refreshFlatListItem method to get the latest data from the database (MongoDB)
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
                        // Show native toast message to inform user that task list was edited successfully
                        ToastModule.showText(`List Edited. Scroll down to update!`, ToastModule.LENGTH_LONG)
                    }}
                >
                    Save List
                </Button>
            </Modal>
        )
    }
}



