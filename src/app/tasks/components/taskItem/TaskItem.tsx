"use client";

import { useState } from 'react';
import styles from "./TaskItem.module.css"; // Import the CSS module
import {useTheme} from "@/context/ThemeContext";
import axios from "axios";

export type Task = {
    _id: string;
    name: string;
    description: string;
    status: "in_progress" | "complete";
    dueDate?: string;
};

interface TaskItemProps {
    task: Task;
    //callback function to refresh tasks in parent
    onTaskUpdate: () => void;
}

const TaskItem = ({task, onTaskUpdate}: TaskItemProps) => {
    const {theme} = useTheme();

    //state for edit mode and form data
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>({ ...task });

    //handles task deletion
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

    //handles status toggle
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

    //handles edit form input changes
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //save edited task
    const handleSaveEdit = async () => {
        try {
            await axios.put(`/api/tasks/${task._id}`, editedTask);
            onTaskUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task. Please try again.");
        }
    };

    //cancel editing
    const handleCancelEdit = () => {
        setEditedTask({ ...task });
        setIsEditing(false);
    };

    //renders editing mode
    if (isEditing) {
        return (
            <div className={`${styles.taskItem} ${theme === "dark" ? styles.dark : styles.light} ${styles.editMode}`}>
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        name="name"
                        value={editedTask.name}
                        onChange={handleEditChange}
                        className={styles.editInput}
                        placeholder="Task Name"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <textarea
                        name="description"
                        value={editedTask.description}
                        onChange={handleEditChange}
                        className={styles.editTextarea}
                        placeholder="Task Description"
                    />
                </div>

                <div className={styles.formGroup}>
                    <select
                        name="status"
                        value={editedTask.status}
                        onChange={handleEditChange}
                        className={styles.editSelect}
                    >
                        <option value="in_progress">In Progress</option>
                        <option value="complete">Complete</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <input
                        type="date"
                        name="dueDate"
                        value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                        onChange={handleEditChange}
                        className={styles.editInput}
                    />
                </div>

                <div className={styles.actionsStacked}>
                    <button onClick={handleSaveEdit} className={styles.saveButton}>Save</button>
                    <button onClick={handleCancelEdit} className={styles.cancelButton}>Cancel</button>
                </div>
            </div>
        );
    }

    // Renders normal view
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

            <div className={styles.actionsStacked}>
                <button onClick={handleToggleStatus} className={styles.toggleButton}>
                    {task.status === "complete" ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button onClick={() => setIsEditing(true)} className={styles.editButton}>Edit</button>
                <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
            </div>
        </div>
    );
};
export default TaskItem;
