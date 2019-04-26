import React, { Component } from 'react';

// Set all the addresses to be constants - abstraction to not having to modify the code when API changes
const apiGetAllTaskLists = 'http://10.0.2.2:3001/todolist/findAll';
const apiInsertTaskLists = 'http://10.0.2.2:3001/todolist/';
const apiUpdateTaskLists = 'http://10.0.2.2:3001/todolist/updateLists';
const apiDeleteTaskLists = 'http://10.0.2.2:3001/todoList/deleteListsById/id';

/**
 * Fetch all the task lists
 */
// Send GET request to insert new data, not specified as GET request is default
async function getTasksFromServer() {
    try {
        // Using fetch method with api address as a parameter
        let response = await fetch(apiGetAllTaskLists);
        let responseJson = await response.json();
        return responseJson.payload; // data is list of all task lists
    } catch (error) {
        console.error(`Error is: ${error}`);
    }
}

/**
 * Insert a task list
 */
// Send POST request to insert new data
async function insertTasksToServer(params) {
    // Return new promise to handle response and errors
    return new Promise(async (resolve, reject) => {
        try {
            console.log(params);
            // Using fetch method with api address as one parameter and object setting as next
            let response = await fetch(apiInsertTaskLists, {
                // specify method as POST
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
                // Wait for response to come back
                responseJson = await response.json();
                // Returned JSON object
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

/**
 * Update a task list
 */
// Send PUT request to update data
async function updateTaskLists(id, data) {
    // Return new promise to handle response and errors
    return new Promise(async (resolve, reject) => {
        try {
            // Using fetch method with api address as one parameter and object setting as next - append item id to the address
            let response = await fetch(`${apiUpdateTaskLists}/${id}`, {
                // specify method as PUT
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                // Body MUST be a string
                body: JSON.stringify(data)
            });
            let responseJson;
            try{
                // Wait for response
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
 * Delete a task list
 */
// Send DELETE request to delete data
async function deleteTaskLists(id){
    // Return new promise to handle response and errors
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

// Make these functions public
export {getTasksFromServer};
export {insertTasksToServer};
export {updateTaskLists};
export {deleteTaskLists};
