import { CheckCircle } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton } from "@mui/material"
import { useState } from "react"

const colors = [
  "#F87171", "#FB923C", "#FBBF24", "#A3E635", "#22D3EE", 
  "#A78BFA", "#F472B6", "#A8A29E"
];

export const ListModal = ({open, handleClose, onSubmit}) => {
  const [listName, setListName] = useState('')
  const [listColor, setListColor] = useState('')

  const handleColorSelect = (color) => {
    setListColor(color)
  }

  const handleSave = () => {
    if(listColor && listName){
      onSubmit(listName, listColor)
      setListName('')
      setListColor('')
      handleClose()
    }else{
      alert('Please fill in the list name and select a color.')
    }
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
      <DialogTitle>New List</DialogTitle>
      <DialogContent>
        <div className="list-modal flex flex-col gap-4">
          <TextField
            placeholder="List name"
            fullWidth
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <Typography variant="body1">Select List Color</Typography>
          <div className="list-modal-color flex gap-4">
            {colors.map((color) => (
              <div key={color}>
                <IconButton
                  onClick={() => handleColorSelect(color)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: listColor === color ? '1px solid #000' : 'none',
                    position: 'relative',
                  }}
                >
                  {listColor === color && (
                    <CheckCircle sx={{ color: 'white', position: 'absolute' }} />
                  )}
                </IconButton>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{padding:'0 24px 20px'}}>
        <button className="flex-1 p-3 rounded-lg border border-stone-300 hover:bg-stone-200" onClick={handleClose}>Discard</button>
        <button className="flex-1 p-3 rounded-lg bg-amber-400 hover:bg-amber-300" onClick={handleSave}>Save</button>
      </DialogActions>
    </Dialog>
    </>
  )
}