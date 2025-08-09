import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
//enable sqlite debugging
SQLite.DEBUG(true)
SQLite.enablePromise(true);
const database_name = 'TodoDB.db';
const database_version = '1.0';
const database_displayname = 'SQLite Todo Database';
const database_size = 200000;
export default function App(){
  const [db, setDb]=useState (null);
  const[todos, setTodos]=useState([]);
const[newTodo, setNewTodo]=useState('');
useEffect(()=>{initializeDatabase();},[]);

const initializeDatabase=async ()=>{
  try{
    const database=await SQLite.openDatabase(
      database_name,
      database_version, database_displayname, database_size
    );
    setDb(database);
    // create table if it doesn't exist
    await database.executeSql(
      `CREATE TABLE IF NOT EXISTS todos(
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
console.log("database initialized successfully");
loadTodos(database);
  }
  catch(error){
    console.error("database initialization failed:", error);
    Alert.alert("error", "failed to initialize database");
  }
};
const loadTodos=async(database=db)=>{
  if(!database) return;
  try{
    const results= await database.executeSql('SELECT * FROM todos ORDER BY created_at DESC');
    const rows= results[0].rows;
    const todoList=[];
    for(let i=0; i<rows.length; i++){
      todoList.push(rows.item(i));
    }
    setTodos(todoList);

  }
  catch(error){
    console.error("failed to load todos:", error);
    Alert.alert("error", "failed to load todos");
  }
}
const addTodo=async ()=>{
  if (! newTodo.trim()){
    Alert.alert('error','please enter a todo item');
    return
  };
  if(! db){
    Alert.alert('error',"database not initialized");
    return;
  }
  try {
    await db.executeSql(
      'INSERT INTO todos (text, completed) VALUES (?,?)',
      [newTodo.trim(),0]
    );
    setNewTodo('');
    loadTodos();
    console.log('todo edit successfully');
  }
  catch(error){
    console.error("failed to add todo", error);
    Alert.alert("error", "failed to add todo");
  }
}
const toggleTodo=async(id, currentStatus)=>{
  if (! db) return;
  try{
    await db.executeSql(
      'UPDATE todos SET completed=? WHERE id=?',
      [currentStatus ? 0:1, id]
    );
    loadTodos();
    console.log('todo status updated');
  }
  catch(error){
    console.error("failed to update todo", error);
    Alert.alert("error", "failed to update todo");
  }
}
}

 