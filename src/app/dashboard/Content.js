import { Add, CalendarToday, FilterList, FormatListNumberedRtl, SwapVert } from '@mui/icons-material';
import { Checkbox, IconButton, Pagination, Menu, MenuItem, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const Content = ({userLists, showList, userTasks, userTags, showTask, createTaskModal, selectedTask, searchKeyword}) => {

  const [filteredTasks, setFilteredTasks] = useState([])
  const [selectTask, onTaskSelect] = useState(null)
  const [selectFilter, setSelectFilter] = useState(null)
  const [sortOrder, setSortOrder] = useState("asc")
  
  useEffect(() => {
    filterTasks(showTask, showList, selectFilter, sortOrder, searchKeyword)
  }, [showTask, showList, userTasks, selectFilter, sortOrder, searchKeyword])
  
  // Filter the task based on user selection
  const filterTasks = (showTask, showList, selectFilter, sortOrder, searchKeyword) => {
    let filtered = userTasks
    if(showList){
      filtered = filtered.filter((task) => task.listId === showList)
    }
    const today = dayjs().startOf('day')
    if(showTask === 'Upcoming'){
      filtered = filtered.filter((task) => dayjs(task.dueDate).isAfter(today))
    }else if(showTask === 'Today'){
      filtered = filtered.filter((task) => dayjs(task.dueDate).isSame(today, 'day') || dayjs(task.dueDate).isBefore(today, 'day'))
    }

    if(selectFilter !== null){
      filtered = filtered.filter((task) => task.isCompleted === selectFilter)
    }

    // Search 
    if(searchKeyword){
      filtered = filtered.filter(
        (task) => task.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchKeyword.toLowerCase()))
      )
    }


    // Sort
    filtered = filtered.sort((a, b) => {
      const dateA = dayjs(a.dueDate)
      const dateB = dayjs(b.dueDate)
      if(sortOrder === 'asc'){
        return dateA.isBefore(dateB) ? -1 : 1
      }else{
        return dateA.isBefore(dateB) ? 1 : -1
      }
    })
    setFilteredTasks(filtered)
  }

  const handleSortOrder = (order) => {
    setSortOrder(order)
    filterTasks(showTask, showList, selectFilter, order)
  }

  const getTaskTags = (tagIds) => {
    return userTags.filter(tag => tagIds.includes(userTags.id))
  }

  useEffect(() => {
    selectedTask(selectTask)
  }, [selectTask])

  // Pagination
  const [tasksPerPage, setTasksPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const paginatedTask = filteredTasks.slice(
    // Start index
    (currentPage - 1) * tasksPerPage,
    // End index 
    currentPage * tasksPerPage
  )

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage)
  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [pageAnchorEl, setPageAnchorEl] = useState(null);
  const handleOpenFilterMenu = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }
  const handleOpenPaginationMenu = (event) => {
    setPageAnchorEl(event.currentTarget)
  }
  const handleOpenSortMenu = (event) => {
    setSortAnchorEl(event.currentTarget)
  }
  const handleCloseFilterMenu = () => {setFilterAnchorEl(null)}
  const handleClosePaginationMenu = () => {setPageAnchorEl(null)}
  const handleCloseSortMenu = () => {setSortAnchorEl(null)}

  return(
    <>
    <div className="dashboard-content flex-1 p-4 space-between mb-8">
      <div className="content-container flex gap-8 flex-col h-full">
        <div className="content-title text-5xl font-bold">
          {showList ? userLists.find(l => l.id === showList)?.name : showTask}
        </div>
        <button className="content-addtask border text-2xl flex items-center gap-4 px-4 py-2 rounded-lg" onClick={createTaskModal}>
          <Add/>
          <div className="content-addtask-label">
            Add a new task
          </div>
        </button>
        <div className="content-option flex gap-4 justify-end items-center">
          <div className="filter-option">
            <Tooltip title='Filter Task' arrow>
              <IconButton onClick={handleOpenFilterMenu}>
                <FilterList/>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleCloseFilterMenu}
            >
              <MenuItem onClick={() => setSelectFilter(true)}>Completed Task</MenuItem>
              <MenuItem onClick={() => setSelectFilter(false)}>Incomplete Task</MenuItem>
            </Menu>
          </div>
          <div className="sort-option">
            <Tooltip title='Sort by due date' arrow>
              <IconButton onClick={handleOpenSortMenu}>
                <SwapVert/>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleCloseSortMenu}
            >
              <MenuItem onClick={() => handleSortOrder('asc')}>Sort by Ascending</MenuItem>
              <MenuItem onClick={() => handleSortOrder('desc')}>Sort by Descending</MenuItem>
            </Menu>
          </div>
          <div className="pagination-option">
            <Tooltip title='Pagination option' arrow>
              <IconButton onClick={handleOpenPaginationMenu}>
                <FormatListNumberedRtl/>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={pageAnchorEl}
              open={Boolean(pageAnchorEl)}
              onClose={handleClosePaginationMenu}
            >
              <MenuItem onClick={() => setTasksPerPage(5)}>5 rows</MenuItem>
              <MenuItem onClick={() => setTasksPerPage(10)}>10 rows</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="content-context flex flex-col gap-4 h-fit max-h-full overflow-auto">
          {/* Filtered Task mapping */}
          {paginatedTask.map((task) => (
            <div className="content-task border p-1" key={task.id} onClick={() => onTaskSelect(task)}>
              <div className="flex items-center justify-between">
                <div className="content-task-left flex items-center">
                  <Checkbox color="success" checked={task.isCompleted}/>
                  <div className="text-xl">
                    {task.title}
                  </div>
                  {task.tagIds.length > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                    {getTaskTags(task.tagIds).map(tag => (
                      <span
                      key={tag.id}
                      className="px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: tag.color}}
                      >
                        {tag.name}
                      </span>
                    ))}
                    </div>
                  )}
                </div>
                <div className="content-task-right px-4">
                  <div className="text-md text-gray-500 flex gap-2">
                    <CalendarToday/>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                  {/* <div className="text-gray-600">
                    {task.description}
                  </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination flex justify-center items-center">
        <div className="pagination-container">
          <Pagination 
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
    </>
  )
}