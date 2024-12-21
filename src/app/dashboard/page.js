"use client"
import { Divider, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { Add, Search, Menu, KeyboardDoubleArrowRight, ChevronLeft, ChecklistRtl, Settings, ExitToApp } from '@mui/icons-material';

const NavigationBar = () => {

  const [navOpen, setNavOpen] = useState(true)
  const [taskSelected, setTaskSelected] = useState('today')
  const [listSelected, setListSelected] = useState(null)

  return(
    <>
    <div className={`navigation-bar ${navOpen ? 'w-80 bg-stone-200' : 'w-20'} h-full flex flex-col p-4 rounded-3xl gap-8 tansition-all duration-300 flex justify-between`}>
      <div className="navigation-bar-top flex flex-col gap-8">
        {/* Menu Section */}
        <div className={`menu-section flex flex-col gap-4`}>
          <div className={`menu-section-topbar flex items-center ${navOpen ? 'justify-between' : 'justify-center'}`}>
          {navOpen && (
            <div className="menu-title font-semibold text-3xl">Menu</div>
          )}
            <button className="navigation-icon" onClick={() => setNavOpen(!navOpen)}>
              {navOpen ? <ChevronLeft sx={{fontSize:'2.5rem'}}/> : <Menu sx={{fontSize:'2.5rem'}}/>}
            </button>
          </div>
          {navOpen && (
          <div className="searchbar">
            <TextField
              variant="outlined"
              fullWidth
              size='small'
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
              <button className={`task-section-label flex items-center gap-4 ${taskSelected === 'upcoming' ? 'font-bold' : 'font-medium'}`} onClick={() => {setTaskSelected('upcoming'), setListSelected(null)}}><KeyboardDoubleArrowRight sx={{color:'grey'}}/>Upcoming</button>
              <button className={`task-section-label flex items-center gap-4 ${taskSelected === 'today' ? 'font-bold' : 'font-medium'}`} onClick={() => {setTaskSelected('today'), setListSelected(null)}}><ChecklistRtl sx={{color:'grey'}}/>Today</button>
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
                <button className="lists-content flex items-center gap-4">
                  <div className="lists-content-color rounded-md w-6 h-6 bg-red-400"></div>
                  <div className="lists-content-title">Personal</div>
                </button>
                <button className="lists-content flex items-center gap-4 ">
                  <div className="lists-content-color rounded-md w-6 h-6 bg-cyan-400"></div>
                  <div className="lists-content-title">Work</div>
                </button>
                <button className="lists-content flex items-center gap-4">
                  <div className="lists-content-color rounded-md w-6 h-6 bg-amber-400"></div>
                  <div className="lists-content-title">List 1</div>
                </button>
                <button className="lists-content flex items-center gap-4">
                  <div className="lists-content-color rounded-md w-6 h-6 bg-red-400"></div>
                  <div className="lists-content-title">Personal</div>
                </button>
                <button className="lists-content flex items-center gap-4 ">
                  <div className="lists-content-color rounded-md w-6 h-6 bg-cyan-400"></div>
                  <div className="lists-content-title">Work</div>
                </button>
                <button className="lists-content flex items-center gap-4">
                  <div className="lists-content-color rounded-md w-6 h-6 bg-amber-400"></div>
                  <div className="lists-content-title">List 1</div>
                </button>
              </div>
              <button className="lists-content flex items-center gap-4">
                <div className="lists-content-icon"><Add/></div>
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
                <div className="tags-title px-2 py-1 rounded bg-red-200">Tag 1</div>
                <div className="tags-title px-2 py-1 rounded bg-red-200">Tag fdjauifohda</div>
                <div className="tags-title px-2 py-1 rounded bg-red-200">Tag 3fdafdajoitejaa</div>
                <div className="tags-title px-2 py-1 rounded bg-red-200">Tag 1fdafdafda</div>
                <div className="tags-title px-2 py-1 rounded bg-red-200">Tag fdahuifdhaofbdiaobf</div>
                <div className="tags-title px-2 py-1 rounded bg-red-200">Tag 3fdafdafda</div>
              </div>
              <button className="tag-section-add flex items-center gap-4">
                <div className="lists-content-icon"><Add/></div>
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

const Content = () => {
  return(
    <>
    <div className="dashboard-content flex-1 bg-blue-500 p-4">This is the content</div>
    </>
  )
}

const TaskDetails = ({detaislOpen}) => {
  return(
    <>
    
    </>
  )
}

export default function Dashboard () {

  const [isDetailsOpen, setDetailsOpen] = useState(false)

  return(
    <>
    <div className="main-dashboard w-full h-full flex justify-center items-center p-4">
      <div className="dashboard-content w-full h-full flex gap-4">
        <NavigationBar/>
        <Content/>
        <TaskDetails/>
        {/* <div className="navbar w-1/6 bg-red-200"></div> */}
        {/* <div className="task-list w-3/6 bg-red-200">
          <button>Open This Task</button>
        </div> */}
        {/* <div className="task-detail w-2/6 bg-red-200">
          <div className="task-details-title">My Task</div>
          <div className="task-details-description">Enter your description</div>
          <div className="task-details-list-category">
            <Select
              labelId='list-category-label'
              id='list-category'
              label='List'
            >
              <MenuItem>Personal</MenuItem>
              <MenuItem>Work</MenuItem>
              <MenuItem>Urgent</MenuItem>
            </Select>
          </div>
          <div className="task-details-due-date">Tomorrow</div>
          <div className="task-details-tags">Tag 1</div>
          <div className="btn-delete-task">Delete Task</div>
          <div className="btn-save-change">Save Changes</div>
        </div> */}
      </div>
    </div>
    </>
  );
}