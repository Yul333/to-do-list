"use client";

import AddTask from "./tasks/components/addTask/AddTask";
import TaskList from "./tasks/components/TaskList";
import { useState } from "react";
import DarkModeToggle from "./tasks/components/DarkModeToggle";

export default function ToDoPage() {
    const [taskRefreshKey, setTaskRefreshKey] = useState(0); // ✅ Force re-render on new task

    const refreshTasks = () => {
        setTaskRefreshKey((prev) => prev + 1); // ✅ Updates key to trigger re-render
    };

    return (
        <div>
            <h1>To-Do-List</h1>
            <DarkModeToggle />
            <AddTask onTaskAdded={refreshTasks} /> {/* ✅ Pass the prop */}
            <TaskList key={taskRefreshKey} /> {/* ✅ Re-renders when tasks are added */}
        </div>
    );
}
