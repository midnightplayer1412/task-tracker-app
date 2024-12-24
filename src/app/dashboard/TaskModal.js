import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';

export const TaskModal = ({handleClose, userLists, open, onSubmit}) => {
  
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [selectedList, setSelectedList] = useState('')
  
  const handleSaveTask = () => {
    if(taskTitle){
      console.log("The list is ", selectedList)
      onSubmit({taskTitle, taskDesc, selectedList})
      handleClose()
      setTaskTitle('')
      setTaskDesc('')
      setSelectedList('')
    }else{
      alert("Please enter the task name")
    }
  }

  const handleEnterKey = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault()
      handleSaveTask()
    }
  }

  const handleListChange = (e) => {
    setSelectedList(e.target.value)
    console.log("List selected: ", e.target.value)
  }

  return(
    <>
    <Dialog 
      open={open} 
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "30rem",  // Make the width 100% of the screen
          maxWidth: "100%",  // Ensures it doesn't exceed the screen width
          margin: 0,  // Remove any margin (if necessary)
        },
      }}
    >
      <DialogTitle>New Task</DialogTitle>
      <DialogContent>
        <div className="modal-content flex flex-col gap-4">
          <TextField
            fullWidth
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder='Task Name'
            onKeyDown={handleEnterKey}
          />
          <TextField
            fullWidth
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder='Description'
            multiline
            minRows={3}
            maxRows={3}
            onKeyDown={handleEnterKey}
          />
          <div className="td-content-list flex items-center gap-4">
              <div className="td-content-list-label font-semibold text-gray-600 min-w-10">
                List
              </div>
              <Select
                fullWidth
                labelId="select-list-label"
                id="select-list"
                value={selectedList}
                size='medium'
                onChange={handleListChange}
                sx={{height:'3rem'}}
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
        </div>
      </DialogContent>
      <DialogActions sx={{padding:'0 24px 20px'}}>
        <button className="flex-1 p-3 rounded-lg border border-stone-300 hover:bg-stone-200" onClick={handleClose}>Discard</button>
        <button className="flex-1 p-3 rounded-lg bg-amber-400 hover:bg-amber-300" onClick={handleSaveTask}>Save</button>
      </DialogActions>
    </Dialog>
    </>
  )
}