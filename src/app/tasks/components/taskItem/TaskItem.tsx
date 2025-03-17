"use client";

import styles from "./TaskItem.module.css"; // Import the CSS module
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";

// ✅ Move type definitions OUTSIDE the component
export type Task = {
    _id: string;
    name: string;
    description: string;
    status: "in_progress" | "complete";
    dueDate?: string;
};

interface TaskItemProps {
    task: Task;
    onTaskUpdate: () => void; // Callback function to refresh tasks in parent
}

// ✅ Single declaration of TaskItem
const TaskItem = ({ task, onTaskUpdate }: TaskItemProps) => {
    const { theme } = useTheme(); // Get theme context

    // Handles task deletion
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            await axios.delete(`/api/tasks/${task._id}`);
            onTaskUpdate();
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        }
    };

    // Handles status toggle
    const handleToggleStatus = async () => {
        try {
            const newStatus = task.status === "in_progress" ? "complete" : "in_progress";

            await axios.put(`/api/tasks/${task._id}`, {
                ...task,
                status: newStatus
            });

            onTaskUpdate();
        } catch (error) {
            console.error("Error updating task status:", error);
            alert("Failed to update task status. Please try again.");
        }
    };

    return (
        <div className={`${styles.taskItem} ${theme === "dark" ? styles.dark : styles.light}`}>
            <h3 className={styles.title}>{task.name}</h3>
            <p className={styles.description}>{task.description}</p>
            <p className={task.status === "complete" ? styles.statusComplete : styles.statusInProgress}>
                {task.status === "complete" ? "✅ Complete" : "🟠 In Progress"}
            </p>
            <p className={styles.dueDate}>
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB") : "Not set"}
            </p>


            <div className={styles.actions}>
                <button onClick={handleToggleStatus} className={styles.toggleButton}>
                    {task.status === "complete" ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
            </div>
        </div>
    );
};

export default TaskItem;
