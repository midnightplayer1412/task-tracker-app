import { Divider, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Add, Search, Menu, KeyboardDoubleArrowRight, ChevronLeft, ChecklistRtl, Tune, Logout, Edit, RemoveCircleOutline, Cancel } from '@mui/icons-material';
import { useAuth } from '@/firebase/AuthContext';
import { deleteList, deleteTag, getUserTasks, updateTask } from '@/function/taskFunction';

export const NavigationBar = ({onListSelect, onTaskSelect, userLists, userTags, createListModal, createTagModal, createSettingModal, searchKeyword}) => {

  const {logout} = useAuth()
  const [navOpen, setNavOpen] = useState(true);
  const [showTask, setShowTask] = useState('Today')
  const [listSelected, setListSelected] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [removeList, setRemoveList] = useState(false)
  const [removeTag, setRemoveTag] = useState(false)
  const {user} = useAuth()

  const handleListClick = (listId) => {
    setListSelected(listId)
    onListSelect(listId)
    setShowTask(null)
  };

  const handleRemoveList = async(listId) => {
    const tasks = await getUserTasks(user.uid)
    const tasksOnlyList = tasks.filter((task) => task.listId === listId)
    tasksOnlyList.forEach(async(task) => {
      await updateTask(task.id, {listId: ''})
    })
    await deleteList(listId)
  }

  const handleRemoveTag = async(tagId) => {
    const tasks = await getUserTasks(user.uid)
    const tasksOnlyTag = tasks.filter((task) => task.tagIds.includes(tagId))
    tasksOnlyTag.forEach(async(task) => {
      const updatedTag = task.tagIds.filter(id => id !== tagId)
      await updateTask(task.id, {tagIds: updatedTag})
    })
    await deleteTag(tagId)
  }

  useEffect(() => {
    onTaskSelect(showTask)
    searchKeyword(searchTerm)
  }, [showTask, searchTerm, removeList, removeTag])

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
            <button className="navigation-icon" onClick={() => setNavOpen(!navOpen)} aria-label={navOpen ? 'Close Navigation' : 'Open Navigation'}>
              {navOpen ? <ChevronLeft sx={{fontSize:'2rem'}} aria-hidden="false"/> : <Menu sx={{fontSize:'2rem'}} aria-hidden="false"/>}
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
              <button className={`task-section-label flex items-center gap-4 ${showTask === 'Upcoming' ? 'font-bold' : 'font-medium'}`} onClick={() => {setShowTask('Upcoming'); setListSelected(null); onListSelect(null)}}><KeyboardDoubleArrowRight sx={{color:'grey'}}/>Upcoming</button>
              <button className={`task-section-label flex items-center gap-4 ${showTask === 'Today' ? 'font-bold' : 'font-medium'}`} onClick={() => {setShowTask('Today'); setListSelected(null); onListSelect(null)}}><ChecklistRtl sx={{color:'grey'}}/>Today</button>
            </div>
          </div>
          <Divider/>
          {/* Lists Section */}
          <div className="list-section flex flex-col gap-4">
            <div className="list-section-title uppercase text-sm font-bold flex justify-between items-center">
              <div>Lists</div>
              <button onClick={() => setRemoveList(!removeList)} title='Remove lists'>
                <Edit fontSize='small'/>
              </button>
            </div>
            <div className="list-section-content flex flex-col gap-4">
              <div className="list-section-lists flex flex-col gap-4 text-lg px-2 max-h-40 overflow-y-auto">
                {/* Lists mapping */}
                {userLists.map(list => (
                  <div className="flex justify-between items-center" key={list.id}>
                    <button className="lists-content flex items-center gap-4 w-full" onClick={() => handleListClick(list.id)}>
                      <div className="lists-content-color rounded-md w-6 h-6" style={{backgroundColor: list.color}}></div>
                      <div className="lists-content-title">{list.name}</div>
                    </button>
                    {removeList && (<button className="flex items-center" onClick={()=> handleRemoveList(list.id)}><RemoveCircleOutline color='disabled'/></button>)}
                  </div>
                ))}
              </div>
              <button className="lists-content flex items-center gap-4 px-2" onClick={createListModal}>
                <Add/>
                <div className="list-content-title">Add New List</div>
              </button>
            </div>
          </div>
          <Divider/>
          {/* Tags Section */}
          <div className="tag-section flex flex-col gap-4">
            <div className="tag-section-title uppercase text-sm font-bold flex justify-between items-center">
              <div>Tags</div>
              <button onClick={() => setRemoveTag(!removeTag)} title='Remove tags'>
                <Edit fontSize='small'/>
              </button>
            </div>
            <div className="tag-section-content flex flex-col gap-4">
              <div className="tag-section-tags flex flex-auto gap-2 text-md max-h-40 flex-wrap overflow-auto">
                {/* Tags mapping */}
                {userTags.map(tag => (
                  <div className="tag-unique relative p-2 rounded rounded-lg flex gap-2 items-center" style={{backgroundColor: tag.color}} key={tag.id}>
                    <button className="tags-title">{tag.name}</button>
                    {removeTag && (
                      <button className="tags-remove-button" onClick={() => handleRemoveTag(tag.id)}>
                        <Cancel fontSize='small'/>
                      </button>)}
                  </div>
                ))}
              </div>
              <button className="tag-section-add flex items-center gap-4 px-2 " onClick={createTagModal}>
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
          <button className="setting-section-setting flex gap-4 items-center" onClick={createSettingModal}>
            <Tune/>
            <div className="setting-label">Setting</div>
          </button>
          <button className="setting-section-signout flex gap-4 items-center" onClick={logout}>
            <Logout/>
            <div className="signout-label">Sign Out</div>
          </button>
        </div>
      </div>
      )}
    </div>
    </>
  )
}