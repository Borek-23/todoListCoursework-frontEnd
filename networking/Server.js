import React, { Component } from 'react';
import { AppRegistry, SectionList, StyleSheet, Text, View, Alert, Platform } from 'react-native';

const apiGetAllTaskLists = 'http://10.0.2.2:3001/todolist/findAll';
const apiInsertTaskLists = 'http://10.0.2.2:3001/todolist/';
const apiUpdateTaskLists = 'http://10.0.2.2:3001/todolist/updateLists/';

// Get all the data to tasks list
async function getTasksFromServer() {
    try {
        let response = await fetch(apiGetAllTaskLists);
        let responseJson = await response.json();
        return responseJson.payload; // data is list of all task lists
    } catch (error) {
        console.error(`Error is: ${error}`);
    }
}

// Post request to insert new data into database
async function insertTasksToServer(params) {
    try {
        let response = await fetch(apiInsertTaskLists, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // Body MUST be a string
            body: JSON.stringify(params)
        });
        let responseJson = await response.json();
        // Decide here what to return
        return responseJson.body;
    } catch (error) {
        console.error(`Error is: ${error}`);
    }
}

// Send PUT request to update data
async function updateTaskLists(params) {
    try {
        let response = await fetch(apiUpdateTaskLists, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });
        let responseJson = await response.json();
        return responseJson.body;
    } catch (error) {
        console.error(`Error is : ${error}`);
    }
}


// Make this function public
export {getTasksFromServer};
export {insertTasksToServer};
export {updateTaskLists};
