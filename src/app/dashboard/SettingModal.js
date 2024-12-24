import { useAuth } from "@/firebase/AuthContext"
import { createNewTask, parseCSV, parseExcel } from "@/function/taskFunction"
import { Close } from "@mui/icons-material"
import { Button, Dialog, DialogContent, Typography } from "@mui/material"
import { useState } from "react"
import { CSVLink } from "react-csv"

export const SettingModal = ({open, handleClose, tasks}) => {

  const [taskFile, setTaskfile] = useState(null)
  const [error, setError] = useState(null)
  const {user} = useAuth()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(file){
      setTaskfile(file)
      setError(null)
    }else{
      setError('Please upload a valid CSV file')
    }
  }

  const handleUpload = async() => {
    const userId = user.uid
    if(!taskFile){
      setError('Please select a file first')
      return
    }
    try{
      let tasks = []
      if(taskFile.type === 'text/csv'){
        tasks = await parseCSV(taskFile)
      }else if(taskFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        tasks = await parseExcel(taskFile)
      }else{
        setError('Please upload a CSV or Excel file')
        return
      }

      for(const task of tasks){
        const {
          listId = '',
          title,
          description = '',
          tagIds = [],
          dueDate = new Date().toISOString(),
          isCompleted = false,
        } = task

        const parsedIsCompleted = (isCompleted === 'true' || isCompleted === true)
        console.log("The for loop data :", task.title)

        await createNewTask(userId, listId, title, description, tagIds, dueDate, parsedIsCompleted)
      }
      alert('Tasks uploaded successfully')
      setTaskfile(null)
    }catch(error){
      console.error('Error uploading file: ', error)
      setError('Failed to upload the file')
    }
  }
    
  return(
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
    >
      <div className="setting-modal-top flex justify-between items-center p-4">
        <div className="setting-modal-title text-xl">Setting</div>
        <button onClick={handleClose}>
          <Close fontSize='medium'/>
        </button>
      </div>
      <div className="setting-modal-bottom"></div>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{display:'none'}}
            id="upload-task-file"
          />
          <Button
            variant='contained'
            fullWidth
            htmlFor='upload-task-file'
            component='label'
          >
            Upload Task
          </Button>
          {error && (<Typography variant='body2' color='error'>{error}</Typography>)}
          <Button
            variant='outlined'
            onClick={handleUpload}
            fullWidth
          >
            Confirm Upload
          </Button>
          <CSVLink
            data={tasks}
            filename='tasks.csv'
          >
            <Button variant='contained' fullWidth>
              Download Task
            </Button>
          </CSVLink>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}