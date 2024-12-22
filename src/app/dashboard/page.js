"use client"
import { Checkbox, Divider, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Add, Search, Menu, KeyboardDoubleArrowRight, ChevronLeft, ChecklistRtl, Settings, ExitToApp, Close, Height } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const lists = [
  {
    "id": "list_01",
    "userId": "user_01",
    "name": "Work",
    "color": "#FF5733",
    "createdAt": "2024-12-22T10:05:00Z",
    "updatedAt": "2024-12-22T10:05:00Z"
  },
  {
    "id": "list_02",
    "userId": "user_01",
    "name": "Personal",
    "color": "#33CFFF",
    "createdAt": "2024-12-22T10:10:00Z",
    "updatedAt": "2024-12-22T10:10:00Z"
  }
];

const tags = [
  {
    "id": "tag_01",
    "userId": "user_01",
    "name": "High Priority",
    "color": "#FF0000",
    "createdAt": "2024-12-22T10:12:00Z"
  },
  {
    "id": "tag_02",
    "userId": "user_01",
    "name": "Meeting",
    "color": "#007BFF",
    "createdAt": "2024-12-22T10:13:00Z"
  }
];

const tasks = [
  {
    "id": "task_01",
    "userId": "user_01",
    "listId": "list_01",
    "title": "Prepare Meeting Notes",
    "description": "Gather all documents and prepare notes for the meeting",
    "tagIds": ["tag_02", "tag_01"],
    "dueDate": "2024-12-23T10:00:00Z",
    "isCompleted": false,
    "createdAt": "2024-12-22T10:15:00Z",
    "updatedAt": "2024-12-22T10:15:00Z",
    "completedAt": null
  },
  {
    "id": "task_02",
    "userId": "user_01",
    "listId": "list_02",
    "title": "Grocery Shopping",
    "description": "Buy fruits, vegetables, and dairy",
    "tagIds": [],
    "dueDate": "2024-12-22T18:00:00Z",
    "isCompleted": false,
    "createdAt": "2024-12-22T10:20:00Z",
    "updatedAt": "2024-12-22T10:20:00Z",
    "completedAt": null
  },
  {
    "id": "task_03",
    "userId": "user_02",
    "listId": "list_03",
    "title": "Fix Bug in Project A",
    "description": "Resolve issue reported by QA team",
    "tagIds": ["tag_03"],
    "dueDate": "2024-12-23T15:00:00Z",
    "isCompleted": false,
    "createdAt": "2024-12-22T11:30:00Z",
    "updatedAt": "2024-12-22T11:30:00Z",
    "completedAt": null
  },
  {
    "id": "task_04",
    "userId": "user_01",
    "listId": "list_01",
    "title": "Send Project Update",
    "description": "Email the project manager with the latest status",
    "tagIds": ["tag_01"],
    "dueDate": "2024-12-22T17:00:00Z",
    "isCompleted": true,
    "createdAt": "2024-12-22T10:25:00Z",
    "updatedAt": "2024-12-22T10:25:00Z",
    "completedAt": "2024-12-22T10:30:00Z"
  }
];

const NavigationBar = ({onListSelect}) => {

  const [navOpen, setNavOpen] = useState(true);
  const [taskSelected, setTaskSelected] = useState('today');
  const [listSelected, setListSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleListClick = (listId) => {
    setListSelected(listId);
    onListSelect(listId);
  };

  return(
    <>
    <div className={`navigation-bar ${navOpen ? 'w-80 bg-stone-100' : 'w-20'} h-full overflow-auto flex flex-col p-4 rounded-3xl gap-8 tansition-all duration-300 justify-between`}>
      <div className="navigation-bar-top flex flex-col gap-8">
        {/* Menu Section */}
        <div className={`menu-section flex flex-col gap-4`}>
          <div className={`menu-section-topbar flex items-center ${navOpen ? 'justify-between' : 'justify-center'}`}>
          {navOpen && (
            <div className="menu-title font-semibold text-2xl">Menu</div>
          )}
            <button className="navigation-icon" onClick={() => setNavOpen(!navOpen)}>
              {navOpen ? <ChevronLeft sx={{fontSize:'2rem'}}/> : <Menu sx={{fontSize:'2rem'}}/>}
            </button>
          </div>
          {navOpen && (
          <div className="searchbar">
            <TextField
              variant="outlined"
              fullWidth
              size='small'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search/>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          )}
        </div>
        {navOpen && (
          <>
          <div className="task-section flex flex-col gap-4">
            <div className="task-section-title uppercase text-sm font-bold">
              Tasks
            </div>
            <div className="task-section-tasks flex flex-col gap-4 text-xl px-2">
              <button className={`task-section-label flex items-center gap-4 ${taskSelected === 'upcoming' ? 'font-bold' : 'font-medium'}`} onClick={() => {setTaskSelected('upcoming'); setListSelected(null); onListSelect(null)}}><KeyboardDoubleArrowRight sx={{color:'grey'}}/>Upcoming</button>
              <button className={`task-section-label flex items-center gap-4 ${taskSelected === 'today' ? 'font-bold' : 'font-medium'}`} onClick={() => {setTaskSelected('today'); setListSelected(null); onListSelect(null)}}><ChecklistRtl sx={{color:'grey'}}/>Today</button>
            </div>
          </div>
          <Divider/>
          {/* Lists Section */}
          <div className="list-section flex flex-col gap-4">
            <div className="list-section-title uppercase text-sm font-bold">
              Lists
            </div>
            <div className="list-section-content flex flex-col gap-4">
              <div className="list-section-lists flex flex-col gap-4 text-lg px-2 max-h-40 overflow-y-auto">
                {/* Lists mapping */}
                {lists.map(list => (
                  <button className="lists-content flex items-center gap-4" key={list.id} onClick={() => handleListClick(list.id)}>
                    <div className="lists-content-color rounded-md w-6 h-6" style={{backgroundColor: list.color}}></div>
                    <div className="lists-content-title">{list.name}</div>
                  </button>
                ))}
              </div>
              <button className="lists-content flex items-center gap-4 px-2">
                <Add/>
                <div className="list-content-title">Add New List</div>
              </button>
            </div>
          </div>
          <Divider/>
          {/* Tags Section */}
          <div className="tag-section flex flex-col gap-4">
            <div className="tag-section-title uppercase text-sm font-bold">
              Tags
            </div>
            <div className="tag-section-content flex flex-col gap-4">
              <div className="tag-section-tags flex flex-auto gap-2 text-md font-semibold max-h-40 flex-wrap overflow-auto">
                {/* Tags mapping */}
                {tags.map(tag => (
                  <div className="tags-title px-2 py-1 rounded bg-red-200" key={tag.id} style={{backgroundColor: tag.color}}>{tag.name}</div>
                ))}
              </div>
              <button className="tag-section-add flex items-center gap-4 px-2 ">
                <Add/>
                <div className="list-content-title">Add New Tag</div>
              </button>
            </div>
          </div>
          </>
        )}
      </div>
      {navOpen && (
      <div className="navigation-bar-bottom">
        {/* Setting Section */}
        <div className="setting-section flex flex-col gap-4 text-xl">
          <button className="setting-section-setting flex gap-4 items-center">
            <Settings/>
            <div className="setting-label">Setting</div>
          </button>
          <button className="setting-section-signout flex gap-4 items-center">
            <ExitToApp/>
            <div className="signout-label">Sign Out</div>
          </button>
        </div>
      </div>
      )}
    </div>
    </>
  )
}

const Content = ({selectedList, onTaskSelect}) => {

  const filteredTask = selectedList ? tasks.filter(task => task.listId === selectedList) : tasks
  const getTaskTags = (tagIds) => {
    return tags.filter(tag => tagIds.includes(tag.id))
  }

  return(
    <>
    <div className="dashboard-content flex-1 p-4">
      <div className="content-container flex gap-8 flex-col h-full">
        <div className="content-title text-5xl font-bold border border-black">
          {selectedList ? lists.find(l => l.id === selectedList)?.name : 'Today'}
        </div>
        <button className="content-addtask border border-black text-2xl flex items-center gap-4 px-4 py-2">
          <Add/>
          <div className="content-addtask-label">
            Add a new task
          </div>
        </button>
        <div className="content-context flex flex-col gap-4 h-fit max-h-full overflow-auto">
          {/* Filtered Task mapping */}
          {filteredTask.map(task => (
            <div className="content-task border border-black p-4" key={task.id} onClick={() => onTaskSelect(task)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600">
                    {task.description}
                  </p>
                  <div className="text-sm text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                {task.tagIds.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {getTaskTags(task.tagIds).map(tag => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: tag.color + '40' }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

const TaskDetails = ({task, onClose}) => {

  
  if(!task){
    return null
  }
  
  const taskList = lists.find(l => l.id === task.listId)
  const taskTags = tags.filter(tag => task.tagIds.includes(tag.id))
  
  const [selectedList, setSelectedList] = useState(task.listId);
  const [selectedDate, setSelectedDate] = useState(task.dueDate);
  const [taskDesc, setTaskDesc] = useState(task.description)
  const [taskName, setTaskName] = useState(task.title)
  const [taskCompleted, setTaskCompleted] = useState(task.isCompleted)
  
  const handleListChange = (event) => {
    const newListId = event.target.value;
    setSelectedList(newListId);
  }
  
  useEffect(() => {
    setSelectedList(task.listId);
    setSelectedDate(task.dueDate)
    setTaskDesc(task.description);
    setTaskName(task.title);
    setTaskCompleted(task.isCompleted);
  }, [task])
  
  console.log(taskTags)
  return(
    <>
    <div className="task-details-content bg-stone-100 w-96 h-full overflow-auto flex flex-col p-4 rounded-3xl justify-between">
      <div className="task-details-top flex flex-col h-full">
        <div className="task-details-menu flex justify-between items-center mb-6">
          <Checkbox
            color="success"
            size="large"
            checked={taskCompleted}
            onChange={() => setTaskCompleted(!taskCompleted)}
          />
          <h2 className="text-2xl font-bold">Task Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 w-[53px] h-[53px]"><Close sx={{fontSize:'2.5rem'}}/></button>
        </div>
        <div className="task-details-content h-5/6 mb-6 flex flex-col gap-4">
          <div className="td-content-name">
            <TextField
              variant="outlined"
              value={taskName}
              placeholder='Task Name'
              fullWidth
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div className="td-content-desc">
            <TextField
              variant="outlined"
              value={taskDesc}
              fullWidth
              multiline
              maxRows={5}
              minRows={5}
              placeholder='Description'
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>
          <div className="td-content-list flex items-center gap-4">
              <div className="td-content-list-label font-semibold text-gray-600 min-w-10">
                List
              </div>
              <Select
                labelId="select-list-label"
                id="select-list"
                value={selectedList}
                size='small'
                onChange={handleListChange}
                sx={{height:'2rem'}}
              >
                {lists.map((list) => (
                  <MenuItem key={list.id} value={list.id}>
                    <div className="td-content-list-value">
                      <div>{list.name}</div>
                    </div>
                  </MenuItem>
                ))}
              </Select>
          </div>
          <div className="td-content-due flex items-center gap-4">
              <div className="td-content-due-label font-semibold text-gray-600">
                Due date
              </div>
              <DatePicker
                value={dayjs(task.dueDate)}
                slots={{
                  textField: (params) => (
                    <TextField
                    {...params}
                    sx={{
                      '& .MuiInputBase-root':{
                        height:'2rem'
                      }
                    }}
                    />
                  )
                }}
              />
          </div>
          <div className="td-content-tag flex items-center gap-4">
            <div className="td-content-tag-label font-semibold text-gray-600">
              Tags
            </div>
            {taskTags.map((tag) => (
              <div className="td-content-tag-value px-2 py-1 rounded text-sm" style={{backgroundColor:tag.color}} key={tag.id} value={tag.id}>
                <div>{tag.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="task-detaisl-bottom flex justify-between items-center gap-4">
        <button className="flex-1 p-3 rounded-lg border border-stone-300 hover:bg-stone-200">Delete Task</button>
        <button className="flex-1 p-3 rounded-lg bg-amber-400 hover:bg-amber-300">Save Change</button>
      </div>

    </div>
    </>
  )
}

export default function Dashboard () {

  const [selectedList, setSelectedList] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  return(
    <>
    <div className="main-dashboard w-full h-full flex justify-center items-center p-4">
      <div className="dashboard-content w-full h-full flex gap-4">
        <NavigationBar onListSelect={setSelectedList}/>
        <Content selectedList={selectedList} onTaskSelect={setSelectedTask}/>
        {selectedTask && (
          <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)}/>
        )}
      </div>
    </div>
    </>
  );
}