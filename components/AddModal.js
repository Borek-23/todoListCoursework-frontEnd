// Modal is where I can have a pop-up window in which I can type
import React, {Component} from 'react';
import {
    Text, Platform,
    Dimensions, TextInput
} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

// Importing insertTasksToSever method from Server.js file
import {insertTasksToServer} from "../networking/Server";

// Importing Native toast module from java files
import { NativeModules } from 'react-native'
const {ToastModule} = NativeModules;

// Dynamically get the dimensions of the screen to render the modal box window
let screen = Dimensions.get('window');

/**
 * Default class export, this is the component
 * */
export default class AddModal extends Component {
    // Declaring constructor to initialise the state props
    constructor(props) {
        super(props);
        this.state = {
            newTaskListName: '',
            newTaskListDescription: '',
            newTasks: ''
        }
    }

    // Defining showAddModal method which fetched the modal box
    showAddModal = () => {
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
                }} >Adding a Task List</Text>

                {/* Input from the user for adding task list name */}
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
                    // This will disappear when user starts typing
                    placeholder="Enter a new Task List name"
                    // Assign the input value to a state
                    value={this.state.newTaskListName}
                />

                {/* Input from the user for adding task list description */}
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
                    // This will disappear when user starts typing
                    placeholder="Enter a new Task List description"
                    // Assign the input value to a state
                    value={this.state.newTaskListDescription}
                />

                {/* Input from the user for adding individual tasks */}
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
                    // This will disappear when user starts typing
                    placeholder="Enter new Task(s) separated by Commas"
                    // Assign the input value to a state
                    value={this.state.newTasks} // this.state.newTasks
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
                        if ((this.state.newTaskListName.length === 0 || this.state.newTasks.length === 0)
                            && (!this.state.newTaskListDescription.length === 0 || (this.state.newTaskListName.length === 0 || this.state.newTasks.length === 0))) {
                            // Alert if condition not met
                            alert("New Task List has to have at least a Name and one or more Tasks");
                            return;
                        }
                        // Set state variables for new task attributes
                        const newTaskList = {
                            name: this.state.newTaskListName,
                            description: this.state.newTaskListDescription,
                            tasks: this.state.newTasks.split(","),
                        };
                        // Call insertTasksToServer method with new task set above
                        insertTasksToServer(newTaskList).then(() => {
                            // Refresh data in the database (MongoDB)
                            this.props.parentFlatList.refreshDataFromServer();
                            // Show native toast message to inform user that task list was added successfully
                            ToastModule.showText(`To-Do List Added!`, ToastModule.LENGTH_SHORT)
                        });
                        // Close modal box after button was pressed
                        this.refs.myModal.close();
                    }}
                >
                    Save List
                </Button>
            </Modal>
        )
    }
}







