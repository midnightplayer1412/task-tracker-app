// `src\app\dashboard\page.js`
"use client"
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { createNewList, createNewTag, createNewTask, getUserLists, getUserTags, getUserTasks } from '@/function/taskFunction';
import { useAuth } from '@/firebase/AuthContext';
import { NavigationBar } from './Navigation';
import { Content } from './Content';
import { TaskDetails } from './TaskDetails';
import { TaskModal } from './TaskModal';
import { ListModal } from './ListModal';
import { useRouter } from 'next/navigation';
import { TagModal } from './TagModal';
// const lists = [
//   {
//     "id": "list_01",
//     "userId": "user_01",
//     "name": "Work",
//     "color": "#FF5733",
//     "createdAt": "2024-12-22T10:05:00Z",
//     "updatedAt": "2024-12-22T10:05:00Z"
//   },
//   {
//     "id": "list_02",
//     "userId": "user_01",
//     "name": "Personal",
//     "color": "#33CFFF",
//     "createdAt": "2024-12-22T10:10:00Z",
//     "updatedAt": "2024-12-22T10:10:00Z"
//   }
// ];

// const tags = [
//   {
//     "id": "tag_01",
//     "userId": "user_01",
//     "name": "High Priority",
//     "color": "#FF0000",
//     "createdAt": "2024-12-22T10:12:00Z"
//   },
//   {
//     "id": "tag_02",
//     "userId": "user_01",
//     "name": "Meeting",
//     "color": "#007BFF",
//     "createdAt": "2024-12-22T10:13:00Z"
//   }
// ];

// const tasks = [
//   {
//     "id": "task_01",
//     "userId": "user_01",
//     "listId": "list_01",
//     "title": "Prepare Meeting Notes",
//     "description": "Gather all documents and prepare notes for the meeting",
//     "tagIds": ["tag_02", "tag_01"],
//     "dueDate": "2024-12-23T10:00:00Z",
//     "isCompleted": false,
//     "createdAt": "2024-12-22T10:15:00Z",
//     "updatedAt": "2024-12-22T10:15:00Z",
//     "completedAt": null
//   },
//   {
//     "id": "task_02",
//     "userId": "user_01",
//     "listId": "list_02",
//     "title": "Grocery Shopping",
//     "description": "Buy fruits, vegetables, and dairy",
//     "tagIds": [],
//     "dueDate": "2024-12-22T18:00:00Z",
//     "isCompleted": false,
//     "createdAt": "2024-12-22T10:20:00Z",
//     "updatedAt": "2024-12-22T10:20:00Z",
//     "completedAt": null
//   },
//   {
//     "id": "task_03",
//     "userId": "user_02",
//     "listId": "list_03",
//     "title": "Fix Bug in Project A",
//     "description": "Resolve issue reported by QA team",
//     "tagIds": ["tag_03"],
//     "dueDate": "2024-12-23T15:00:00Z",
//     "isCompleted": false,
//     "createdAt": "2024-12-22T11:30:00Z",
//     "updatedAt": "2024-12-22T11:30:00Z",
//     "completedAt": null
//   },
//   {
//     "id": "task_04",
//     "userId": "user_01",
//     "listId": "list_01",
//     "title": "Send Project Update",
//     "description": "Email the project manager with the latest status",
//     "tagIds": ["tag_01"],
//     "dueDate": "2024-12-22T17:00:00Z",
//     "isCompleted": true,
//     "createdAt": "2024-12-22T10:25:00Z",
//     "updatedAt": "2024-12-22T10:25:00Z",
//     "completedAt": "2024-12-22T10:30:00Z"
//   }
// ];









export default function Dashboard () {

  const [showList, setShowList] = useState(null)
  const [showTask, setShowTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Default check at the beginning
  const {user, loading} = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if(!loading && !user){
      router.push('/')
    }
  }, [user, loading, router])

  // Use to get all the user list, task, tag 
  const [userLists, setUserLists] = useState([])
  const [userTasks, setUserTasks] = useState([])
  const [userTags, setUserTags] = useState([])
  
  useEffect(() => {
    if(user && !loading){
      const fetchUserLists = async() => {
        try{
          const lists = await getUserLists(user.uid)
          setUserLists(lists)
        }catch(error){
          console.error('Error fetching lists: ', error)
        }
      }
      const fetchUserTasks = async() => {
        try{
          const tasks = await getUserTasks(user.uid)
          setUserTasks(tasks)
        }catch(error){
          console.error('Error fetching tasks: ', error)
        }
      }
      const fetchUserTags = async() => {
        try{
          const tags = await getUserTags(user.uid)
          setUserTags(tags)
        }catch(error){
          console.error('Error fetching tags: ', error)
        }
      }
      fetchUserLists()
      fetchUserTasks()
      fetchUserTags()
    }
  }, [user, loading, userLists, userTasks, userTags])
  
  // Use to handle All the Modal
  const [createTaskModal, setCreateTaskModal] = useState(false)
  const [createListModal, setCreateListModal] = useState(false)
  const [createTagModal, setCreateTagModal] = useState(false)
  const handleOpenCreateTaskModal = () => {setCreateTaskModal(true)};
  const handleCloseCreateTaskModal = () => {setCreateTaskModal(false)};
  const handleOpenCreateListModal = () => {setCreateListModal(true)};
  const handleCloseCreateListModal = () => {setCreateListModal(false)};
  const handleOpenCreateTagModal = () => {setCreateTagModal(true)}
  const handleCloseCreateTagModal = () => {setCreateTagModal(false)}

  const handleSubmitTask = async({taskTitle, taskDesc, selectedList}) => {
    const userId = user.uid
    const taskTag = []
    const dueDate = new Date().toISOString()
    try{
      createNewTask(userId, selectedList, taskTitle, taskDesc, taskTag, dueDate)
      console.log("New task created")
    }catch(error){
      console.error('Error creating task: ', error)
    }
  }

  // Use to create new list and store to database
  const handleCreateNewList = (listName, listColor) => {
    const userId = user.uid
    try{
      createNewList(userId, listName, listColor)
      console.log("New list created")
    }catch(error){
      console.error('Error creating list: ', error)
    }
  }

  // Use to create new tag and store to database
  const handleCreateNewTag = (tagName, tagColor) => {
    const userId = user.uid
    try{
      createNewTag(userId, tagName, tagColor)
      console.log("New tag created")
    }catch(error){
      console.error('Error creating tag: ', error)
    }
  }

  return(
    <>
    <div className="main-dashboard w-full h-full flex justify-center items-center p-4">
      <div className="dashboard-content w-full h-full flex gap-4">
        <NavigationBar onListSelect={setShowList} onTaskSelect={setShowTask} userLists={userLists} userTags={userTags} createListModal={handleOpenCreateListModal} createTagModal={handleOpenCreateTagModal}/>
        {/* <Content userLists={userLists} userTasks={userTasks} selectedList={selectedList} onTaskSelect={setSelectedTask} createTaskModal={handleOpenCreateTaskModal}/> */}
        <Content userLists={userLists} userTasks={userTasks} showList={showList} showTask={showTask} createTaskModal={handleOpenCreateTaskModal} selectedTask={setSelectedTask}/>
        {selectedTask && (
          <TaskDetails userTasks={selectedTask} userLists={userLists} userTags={userTags} onClose={() => setSelectedTask(null)}/>
        )}
        <TaskModal open={createTaskModal} userLists={userLists} handleClose={handleCloseCreateTaskModal} onSubmit={handleSubmitTask}/>
        <ListModal open={createListModal} handleClose={handleCloseCreateListModal} onSubmit={handleCreateNewList}/>
        <TagModal open={createTagModal} handleClose={handleCloseCreateTagModal} onSubmit={handleCreateNewTag}/>
      </div>
    </div>
    </>
  );
}