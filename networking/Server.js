import React, { Component } from 'react';
import { AppRegistry, SectionList, StyleSheet, Text, View, Alert, Platform } from 'react-native';

const apiGetAllTaskLists = 'http://10.0.2.2:3001/todolist/findAll';
const apiInsertTaskLists = 'http://10.0.2.2:3001/todolist/';
const apiUpdateTaskLists = 'http://10.0.2.2:3001/todolist/updateLists';
const apiDeleteTaskLists = 'http://10.0.2.2:3001/todoList/deleteListsById/id';

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
    return new Promise(async (resolve, reject) => {
        try {
            console.log(params);
            let response = await fetch(apiInsertTaskLists, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                // Body MUST be a string
                body: JSON.stringify(params)
            });
            let responseJson;
            try{
                console.log(response);
                responseJson = await response.json();
                resolve(responseJson);
            } catch(err) {
                console.log(err);
                reject(err);
            }
        } catch (error) {
            console.error(`Error is: ${error}`);
            reject(error);
        }
    })
}

// Send PUT request to update data
async function updateTaskLists(id, data) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(`${apiUpdateTaskLists}/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            let responseJson;
            try{
                responseJson = await response.json();
                console.log(responseJson)
            } catch(e){
                console.log(e);
                return reject(e)
            }
            resolve(responseJson);
        } catch (error) {
            console.error(`Error is : ${error}`);
        }
    })
}

/**
 * Delete a task
 * @param id
 * @returns {Promise<Promise<*> | Promise<*>>}
 */
async function deleteTaskLists(id){
    return new Promise(async(resolve, reject) => {
        try {
            let response = await fetch(`${apiDeleteTaskLists}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            let responseJson;
            console.log(response);
            try{
                responseJson = await response.json();
            } catch(e){
                console.log("Is erroring.");
                console.log(e);
                return reject(e)
            }
            resolve(responseJson);
        } catch (error) {
            console.error(`Error is : ${error}`);
        }
    })
}


// Make this function public
export {getTasksFromServer};
export {insertTasksToServer};
export {updateTaskLists};
export {deleteTaskLists};
