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
    Alert.alert("error", "failed to load todos");
  }
};
const loadTodos=async(database=db)=>{
  if(!database) return;
  try{}
  catch(error){
    console.error("failed to load todos:", error);
    Alert.alert("error", "failed to load todos");
  }
}
}

 