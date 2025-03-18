"use client";

import AddTask from "./tasks/components/addTask/AddTask";
import TaskList from "./tasks/components/taskList/TaskList";
import { useState } from "react";
import DarkModeToggle from "./tasks/components/DarkModeToggle";

export default function ToDoPage() {
    const [taskRefreshKey, setTaskRefreshKey] = useState(0);

    //updates key to trigger re-render
    const refreshTasks = () => {
        setTaskRefreshKey((prev) => prev + 1);
    };

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>To-Do-List</h1>
                <DarkModeToggle/>
            </div>
            <AddTask onTaskAdded={refreshTasks}/>
            {/*re-renders when tasks are added */}
            <TaskList key={taskRefreshKey}/>
        </div>
    );
}
