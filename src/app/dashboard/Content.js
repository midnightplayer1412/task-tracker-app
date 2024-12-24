import { Add } from '@mui/icons-material';
import { Pagination } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const Content = ({userLists, showList, userTasks, showTask, createTaskModal, selectedTask}) => {

  const [filteredTasks, setFilteredTasks] = useState([])
  const [selectTask, onTaskSelect] = useState(null)
  
  useEffect(() => {
    filterTasks(showTask, showList)
  }, [showTask, showList, userTasks])
  
  // Filter the task based on user selection
  const filterTasks = (showTask, showList) => {
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
    setFilteredTasks(filtered)
    setCurrentPage(1)
  }

  const getTaskTags = (tagIds) => {
    return tags.filter(tag => tagIds.includes(tag.id))
  }

  useEffect(() => {
    selectedTask(selectTask)
  }, [selectTask])

  // Pagination
  const tasksPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1)
  const paginatedTask = filteredTasks.slice(
    // Start index
    (currentPage - 1) * tasksPerPage,
    // End index 
    currentPage * tasksPerPage
  )

  const handlePageChange = (direction) => {
    if(direction === 'next' && currentPage < totalPages){
      setCurrentPage((prevPage) => prevPage + 1)
    }else if(direction === 'previous' && currentPage > 1){
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const totalPages = Math.ceil(filterTasks.length / tasksPerPage)

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
        <div className="content-option flex gap-4 justify-end">
          <div className="filter">filter</div>
          <div className="sort">sort</div>
        </div>
        <div className="content-context flex flex-col gap-4 h-fit max-h-full overflow-auto">
          {/* Filtered Task mapping */}
          {filteredTasks.map((task) => (
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
      <div className="pagination flex justify-center items-center">
        <div className="pagination-container">
          <Pagination count={totalPages}/>
        </div>
      </div>
    </div>
    </>
  )
}