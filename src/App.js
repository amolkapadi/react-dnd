import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const initialData = {
  inProcess: [
    { id: '1', content: 'Task 1' },
    { id: '2', content: 'Task 2' },
  ],
  completed: [
    { id: '3', content: 'Task 3' },
    { id: '4', content: 'Task 4' },
  ],
};

function App() {
  const [taskData, setTaskData] = useState(initialData);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        taskData[source.droppableId],
        source.index,
        destination.index
      );
      setTaskData({ ...taskData, [source.droppableId]: items });
    } else {
      // Moving items between different lists
      const result = move(
        taskData[source.droppableId],
        taskData[destination.droppableId],
        source,
        destination
      );
      setTaskData({
        ...taskData,
        [source.droppableId]: result[source.droppableId],
        [destination.droppableId]: result[destination.droppableId],
      });
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (sourceList, destList, source, destination) => {
    const sourceClone = Array.from(sourceList);
    const destClone = Array.from(destList);
    const [removed] = sourceClone.splice(source.index, 1);
    destClone.splice(destination.index, 0, removed);

    return {
      [source.droppableId]: sourceClone,
      [destination.droppableId]: destClone,
    };
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        <div className="columns">
          {/* In Process Section */}
          <Droppable droppableId="inProcess">
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2>In Process</h2>
                {taskData.inProcess.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="task-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {task.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Completed Section */}
          <Droppable droppableId="completed">
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2>Completed</h2>
                {taskData.completed.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="task-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {task.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
