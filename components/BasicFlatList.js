import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert, Platform, TouchableHighlight, RefreshControl} from 'react-native';
import Swipeout from 'react-native-swipeout';

// Importing of Modals, pop-up boxes to add and delete tasks
import EditModal from './EditModal';
import AddModal from './AddModal';

// Importing methods from Server.js file so I can call them
import {deleteTaskLists, getTasksFromServer, updateTaskLists} from "../networking/Server";
import {App, AppContainer} from "../App";

// This is for importing Toas Native Modules
import { NativeModules } from 'react-native'
const {ToastModule} = NativeModules;

/**
 * Base class Declaration
 * */
class FlatListItem extends Component {
    // Cnstructor to initialise state
    constructor(props) {
        // Always have to call super with props as a parameter
        super(props);
        // These are initial values to set state
        this.state = {
            activeRowKey: null,
            numberOfRefresh: 0,
            item: {}
        };
    }

    // Will change the state of the flat list item after it's been edited
    refreshFlatListItem = (changedItem) => {
        this.setState({item: changedItem});
    };

    render() {
        // This is a constat which sets up the behaviour of swiping for all list items
        const swipeSettings = {
            // Close itself automatically
            autoClose: true,
            // onClose method initialise list items as closed
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            // onOpen method sets the key of the item swiped to be active item (selects it)
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.item.key });
            },
            // Setting of behaviour when swiped right
            right: [
                // Button
                {
                    onPress: () => {
                        // Here need to change the state and re-render the component
                        let selectedItem = this.state.item.name ? this.state.item : this.props.item;
                        // Call method showEditModal which performs editing
                        this.props.parentFlatList.refs.editModal.showEditModal(selectedItem, this);
                    },
                    // This sets a button type to be 'primary' displaying text Edit
                    text: 'Edit', type: 'primary'
                },
                // Buttons
                {
                    onPress: () => {
                        // Select the row (list item) to be active
                        const deletingRow = this.state.activeRowKey;
                        // Display alert box
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete ?',
                            [
                                // No button, will just cancel the alert box
                                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                // Yes button, this will delete task list and displays native Toast message
                                {
                                    text: 'Yes', onPress: () => {
                                        // Call deleteTaskLists method with selected item key (id from MongoDB)
                                        deleteTaskLists(this.props.item._id)
                                            .then(() => {
                                            this.props.parentFlatList.refreshFlatList(deletingRow);
                                            // Call native android module to display toast message
                                            ToastModule.showText(`To-Do List Deleted. Scroll down to update!`, ToastModule.LENGTH_SHORT)
                                        }).catch((error) => {
                                            console.log(`error = ${error}`);
                                            alert("Failed to remove task from the API.");
                                        });

                                    }
                                },
                            ],
                            { cancelable: true }
                        );
                    },
                    // This sets a button type to be 'delete' displaying text Delete
                    text: 'Delete', type: 'delete'
                }
            ],
            rowId: this.props.index,
            sectionId: 1
        };

        return (
            // Apply swipe settings defined above
            <Swipeout {...swipeSettings}>
                {/* The root View to display the list items */}
                <View style={{
                    flex: 1,
                    flexDirection:'column',
                }}>
                    {/* View that contains each individual list item */}
                    <View style={{
                        flex: 1,
                        flexDirection:'row',
                        backgroundColor: '#2f4f4f'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection:'column',
                        }}>
                            {/* Defining data to be displayed inside the flat list */}
                            <Text style={styles.flatListItem}>List Name:{'\n'}{this.state.item.name ? this.state.item.name : this.props.item.name}</Text>
                            <Text style={styles.flatListItem}>List Description:{'\n'}{this.state.item.description ? this.state.item.description : this.props.item.description}</Text>
                            <Text style={styles.flatListItem}>Tasks:{'\n'}{this.state.item.tasks ? this.state.item.tasks : this.props.item.tasks.join('\n')}</Text>
                            <Text style={styles.flatListItem}>Created On:{'\n'}{this.state.item.listCreatedOn ? this.state.item.listCreatedOn : this.props.item.listCreatedOn}</Text>
                        </View>

                    </View>
                    {/* Border between each list item */}
                    <View style={{
                        height: 1,
                        backgroundColor:'white'
                    }}>

                    </View>
                </View>
            </Swipeout>
        );
    }
}

/**
 * Styles Declaration
 * */
const styles = StyleSheet.create({
    flatListItem: {
        color: '#f0fff0',
        padding: 5,
        fontSize: 16,
    },
    todoSign: {
        fontSize: 26,
        fontStyle: 'italic',
        color: 'teal',
        textAlign: 'center',
        textShadowColor: '#708090',
        textShadowRadius: 4,
        padding: 10
    }
});

/**
 * Default class export, this will get rendered
 * */
export default class BasicFlatList extends Component {
    // Constructor initialising state
    constructor(props) {
        super(props);
        this.state = ({
            deletedRowKey: null,
            refreshing: false,
            tasksFromServer: []
        });
        // bind "this" to be a FlatList object
        this._onPressAdd = this._onPressAdd.bind(this);
    }

    // Re-rending the user interface is done here
    componentDidMount() {
        this.refreshDataFromServer();
    }

    // This function is using a Promise and it refreshes data from the API
    refreshDataFromServer = () => {
        this.setState({ refreshing: true });
        // call the getTasksFromServer method which fetches the newest database object
        getTasksFromServer().then((tasks) => {
            this.setState({ tasksFromServer: tasks });
            this.setState({ refreshing: false });
        }).catch((error) => {
            this.setState({ tasksFromServer: [] });
            this.setState({ refreshing: false });
        });
    };
    onRefresh = () => {
        this.refreshDataFromServer();
    };

    // calling refreshFlatList method to set the new state of the items based on MongoDB
    refreshFlatList = (activeKey) => {
        this.setState((prevState) => {
            return {
                deletedRowKey: activeKey
            }
        });
        // Scroll to end after item deleted
        this.refs.flatList.scrollToEnd();
    };

    // When plus icon is pressed the AddModal to add task lists is displayed
    _onPressAdd () {
        this.refs.addModal.showAddModal();
    }

    // This will display the items on the screen
    render() {
        return (
            // A border with name of the screen and add button, will adjust it's topMargin depending on platform
            <View style={{flex: 1, marginTop: Platform.OS === 'android' ? 0 : 34}}>
                <View style={{
                    backgroundColor: '#ffebcd',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 60
                }}>
                    {/* Name of the screen label */}
                    <Text style={styles.todoSign}>To-Do List Manager</Text>

                    {/* The add button */}
                    <TouchableHighlight
                        style={{marginRight: 10}}
                        underlayColor = '#ffebcd'
                        onPress={this._onPressAdd}
                    >

                        {/* Custom image of the add button */}
                        <Image
                            style={{width: 45, height: 45}}
                            source={require('../icons/addIcon.png')}
                        />
                    </TouchableHighlight>
                </View>

                {/* This is the actual list items being rendered on the screen */}
                <FlatList
                    // Custom reference to the flat list
                    ref={"flatList"}
                    // Set the data from the database to be displayed
                    data={this.state.tasksFromServer}
                    // Render the items list on the screen
                    renderItem={({item, index})=>{
                        return (
                            <FlatListItem item={item} index={index} parentFlatList={this}>

                            </FlatListItem>);
                    }}
                    // This will make a Task List id (MongoDB id) as a key
                    keyExtractor={(item, index) => item._id} // item.name
                    // Re-render list after changes
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                >

                </FlatList>

                {/* Add Modal box to add items */}
                <AddModal ref={'addModal'} parentFlatList={this} >

                </AddModal>

                {/* Edit Modal box to edit items */}
                <EditModal ref={'editModal'} parentFlatList={this}>

                </EditModal>
            </View>
        )
    }
}





