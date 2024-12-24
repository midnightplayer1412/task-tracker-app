import { Checkbox, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { deleteTask, updateTask } from '@/function/taskFunction';

export const TaskDetails = ({userTasks, userLists, userTags, onClose}) => {

  
  if(!userTasks){
    return null
  }
  
  const taskList = userLists.find(l => l.id === userTasks.listId)
  const taskTags = userTags.filter(tag => userTasks.tagIds.includes(tag.id))
  
  const [taskId, setTaskId] = useState(userTasks.id)
  const [selectedList, setSelectedList] = useState(userTasks.listId);
  const [selectedDate, setSelectedDate] = useState(dayjs(userTasks.dueDate));
  const [taskDesc, setTaskDesc] = useState(userTasks.description)
  const [taskName, setTaskName] = useState(userTasks.title)
  const [taskCompleted, setTaskCompleted] = useState(userTasks.isCompleted)
  
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
      updatedAt: new Date().toISOString()
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
  
  useEffect(() => {
    setTaskId(userTasks.id)
    setSelectedList(userTasks.listId);
    setSelectedDate(dayjs(userTasks.dueDate))
    setTaskDesc(userTasks.description);
    setTaskName(userTasks.title);
    setTaskCompleted(userTasks.isCompleted);
  }, [userTasks])
  
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
        <button className="flex-1 p-3 rounded-lg border border-stone-300 hover:bg-stone-200" onClick={handleDeleteTask}>Delete Task</button>
        <button className="flex-1 p-3 rounded-lg bg-amber-400 hover:bg-amber-300" onClick={handleSaveChange}>Save Change</button>
      </div>

    </div>
    </>
  )
}