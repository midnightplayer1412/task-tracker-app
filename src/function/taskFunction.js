import { db } from "@/firebase/firebase-config"
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore"


// Local Storage
const TASKS_KEY = 'tasks'
const LISTS_KEY = 'lists'
const TAGS_KEY = 'tags'

// Firestore Collection
const TASKS_COLLECTION = 'Tasks'
const LISTS_COLLECTION = 'Lists'
const TAGS_COLLECTION = 'Tags'

export const getLocalData = (key) => {
  if(typeof window !== 'undefined'){
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  return null
}

export const setLocalData = (key, data) => {
  if(typeof window !== 'undefined'){
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// Create new list
export const createNewList = async(userId, listName, listColor) => {
  try{
    const listRef = collection(db, LISTS_COLLECTION)
    const newList = await addDoc(listRef, {
      userId: userId,
      name: listName,
      color: listColor,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp() 
    })
    console.log("List created with ID: ", newList.id)
  }catch(error){
    console.error('Error adding list to Firestore: ', error)
  }
}

// Get user list
export const getUserLists = async(userId) => {
  try{
    const listsRef = collection(db, LISTS_COLLECTION)
    const q = query(listsRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    const lists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return lists
  }catch(error){
    console.error('Error fetching user lists: ', error)
    return []
  }
}

// Create new task
export const createNewTask = async(userId, listId, taskName, taskDesc, tagId, dueDate) => {
  try{
    const taskRef = collection(db, TASKS_COLLECTION)
    const newTask = await addDoc(taskRef, {
      userId: userId,
      listId: listId,
      title: taskName,
      description: taskDesc,
      tagIds: tagId || [],
      dueDate: dueDate,
      isCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completedAt: null
    })
    console.log("Task created with ID: ", newTask.id)
  }catch(error){
    console.error('Error adding task to Firestore: ', error)
  }
}

// Get user task
export const getUserTasks = async(userId) => {
  try{
    const tasksRef = collection(db, TASKS_COLLECTION)
    const q = query(tasksRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return tasks
  }catch(error){
    console.error('Error fetching user tasks: ', error)
    return []
  }
}

// Create new tag
export const createNewTag = async(userId, tagName, tagColor) => {
  try{
    const tagRef = collection(db, TAGS_COLLECTION)
    const newTag = await addDoc(tagRef, {
      userId: userId,
      name: tagName,
      color: tagColor,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp() 
    })
    console.log("List created with ID: ", newTag.id)
  }catch(error){
    console.error('Error adding list to Firestore: ', error)
  }
}

// Get user tag
export const getUserTags = async(userId) => {
  try{
    const tagsRef = collection(db, TAGS_COLLECTION)
    const q = query(tagsRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    const tags = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return tags
  }catch(error){
    console.error('Error fetching user tags: ', error)
    return []
  }
}

// Update task details
export const updateTask = async(taskId, taskData) => {
  try{
    const taskRef = doc(db, TASKS_COLLECTION, taskId)
    await updateDoc(taskRef, taskData)
    console.warn('Task updated successfully')
  }catch(error){
    console.error('Error updating task: ', error)
  }
}

// Detele task 
export const deleteTask = async(taskId) => {
  try{
    const taskRef = doc(db, TASKS_COLLECTION, taskId)
    await deleteDoc(taskRef)
    console.warn('Task deleted successfully')
  }catch(error){
    console.error('Error deleting task: ', error)
  }
}