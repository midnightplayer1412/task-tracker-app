import { Checkbox, Menu, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Add, Close, Remove } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { deleteTask, updateTask } from '@/function/taskFunction';

export const TaskDetails = ({userTasks, userLists, userTags, onClose}) => {

  
  if(!userTasks){
    return null
  }
  
  const taskTags = userTags.filter(tag => userTasks.tagIds.includes(tag.id))
  
  const [taskId, setTaskId] = useState(userTasks.id)
  const [selectedList, setSelectedList] = useState(userTasks.listId);
  const [selectedDate, setSelectedDate] = useState(dayjs(userTasks.dueDate));
  const [taskDesc, setTaskDesc] = useState(userTasks.description)
  const [taskName, setTaskName] = useState(userTasks.title)
  const [taskCompleted, setTaskCompleted] = useState(userTasks.isCompleted)
  const [taskTag, setTaskTag] = useState(userTasks.tagIds)
  const [displayTag, setDisplayTag] = useState(userTags.filter(tag => userTasks.tagIds.includes(tag.id)))
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null)
  
  useEffect(() => {
    setTaskId(userTasks.id)
    setSelectedList(userTasks.listId);
    setSelectedDate(dayjs(userTasks.dueDate))
    setTaskDesc(userTasks.description);
    setTaskName(userTasks.title);
    setTaskCompleted(userTasks.isCompleted);
    setTaskTag(userTasks.tagIds)
    setDisplayTag(userTags.filter(tag => userTasks.tagIds.includes(tag.id)))
    setSelectedTag(null)
    // console.warn("The taskTags is ", taskTags)
    // console.warn("The taskTag is ", taskTag)
  }, [userTasks])
  
  const handleListChange = (event) => {
    const newListId = event.target.value;
    setSelectedList(newListId);
  }

  const handleSaveChange = async() => {
    const taskData = {
      title: taskName,
      description: taskDesc,
      listId: selectedList,
      dueDate: selectedDate.toISOString(),
      isCompleted: taskCompleted,
      updatedAt: new Date().toISOString(),
      tagIds: taskTag
    }
    try{
      await updateTask(taskId, taskData)
      onClose()
    }catch(error){
      console.error('Error updating task: ', error)
    }
  }

  const handleDeleteTask = async() => {
    try{
      await deleteTask(taskId)
      onClose()
    }catch(error){
      console.error('Error deleting task: ', error)
    }
  }
  


  // Handle opening and closing of the dropdown menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle tag selection
  const handleTagSelect = (tag) => {
    if(!taskTag.includes(tag.id)){
      setTaskTag(prevTags => [...prevTags, tag.id])
      setDisplayTag(prevTags => [...prevTags, tag])
    }
    setSelectedTag(null)
    setAnchorEl(null)
  };

  const handleRemoveTag = (tagId) => {
    setTaskTag(prevTags => prevTags.filter(id => id !== tagId))
    setDisplayTag(prevTags => prevTags.filter(tag => tag.id !== tagId))
  }
  
  return(
    <>
    <div className="task-details-content bg-stone-100 w-96 overflow-auto flex flex-col p-4 rounded-3xl justify-between">
      <div className="task-details-top flex flex-col h-full">
        <div className="task-details-menu flex justify-between items-center mb-6">
          <Checkbox
            color="success"
            size="large"
            checked={Boolean(taskCompleted)}
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
                {userLists.map((list) => (
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
                value={selectedDate}
                onChange={(newDate)=>{setSelectedDate(newDate)}}
                slotProps={{
                  textField: {
                    size: 'small',
                  }
                }}
              />
          </div>
          <div className="td-content-tag flex gap-4">
            <div className="td-content-tag-label font-semibold text-gray-600">
              Tags
            </div>
            <div className="flex gap-4 flex flex-wrap overflow-auto max-h-40">
              {displayTag.map((tag) => (
                <button className="td-content-tag-value px-2 py-1 rounded text-sm flex items-center gap-1" style={{backgroundColor:tag.color}} key={tag.id} onClick={() => handleRemoveTag(tag.id)}>
                  <Remove/>
                  <div className='flex items-center'>{tag.name}</div>
                </button>
              ))}
              {/* {selectedTag && (
                <div className="td-content-tag-value px-2 py-1 rounded text-sm flex items-center" style={{backgroundColor:selectedTag.color}} key={selectedTag.id} value={selectedTag.id}>
                  <div>{selectedTag.name}</div>
                </div>
              )} */}
              <button className="bg-stone-200 rounded flex pr-2 py-1 justify-evenly items-center" onClick={handleClick}>
                <Add/>
                Add a tag
              </button>
              <Menu
                anchorEl={anchorEl} // Anchor element for the dropdown
                open={Boolean(anchorEl)} // Menu is open if anchorEl is set
                onClose={handleClose} // Close the dropdown
              >
                {userTags.map((tag) => (
                  <MenuItem key={tag.id} onClick={() => handleTagSelect(tag)}>
                    <div>
                      {tag.name}
                    </div>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <div className="task-details-bottom flex justify-between items-center gap-4 mt-8">
        <button className="flex-1 p-3 rounded-lg border border-stone-300 hover:bg-stone-200" onClick={handleDeleteTask}>Delete Task</button>
        <button className="flex-1 p-3 rounded-lg bg-amber-400 hover:bg-amber-300" onClick={handleSaveChange}>Save Change</button>
      </div>

    </div>
    </>
  )
}