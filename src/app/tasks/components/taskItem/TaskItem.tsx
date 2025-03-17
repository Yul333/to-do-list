"use client";

import { useState } from "react";
import axios from "axios";

// Define the Task interface (ensure this matches the API and TaskList export)
export interface Task {
    _id: string;
    name: string;
    description: string;
    status: "in_progress" | "complete";
    dueDate?: string;
}

// Define props interface for TaskItem
interface TaskItemProps {
    task: Task;
    onTaskUpdate: () => void;
}

// Define form data interface to match the form fields
interface FormData {
    name: string;
    description: string;
    status: "in_progress" | "complete";
    dueDate: string;
}

const TaskItem = ({ task, onTaskUpdate }: TaskItemProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form state with task values
    const [formData, setFormData] = useState<FormData>({
        name: task.name,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate || "",
    });

    // Validate date format (mm/dd/yyyy)
    const validateDate = (dateStr: string): boolean => {
        if (!dateStr) return true; // Allow empty due date
        const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
        return regex.test(dateStr);
    };

    // Handle form input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Validate dueDate format
        if (name === "dueDate" && value && !validateDate(value)) {
            setError("Please enter a valid date in mm/dd/yyyy format");
            return;
        }

        setError(null);
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle task update
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);

        try {
            await axios.put(`/api/tasks/${task._id}`, formData);
            setIsEditing(false);
            onTaskUpdate();
        } catch (error) {
            console.error("Error updating task", error);
            setError("Failed to update task, try again later");
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle task deletion
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        setIsDeleting(true);
        setError(null);

        try {
            await axios.delete(`/api/tasks/${task._id}`);
            onTaskUpdate();
        } catch (error) {
            console.error("Error deleting task:", error);
            setError("Failed to delete task. Please try again.");
            setIsDeleting(false);
        }
    };

    // Toggle task status
    const handleToggleStatus = async () => {
        setError(null);
        try {
            const newStatus: "in_progress" | "complete" =
                task.status === "in_progress" ? "complete" : "in_progress";
            await axios.put(`/api/tasks/${task._id}`, { ...task, status: newStatus });
            onTaskUpdate();
        } catch (error) {
            console.error("Error updating task status:", error);
            setError("Failed to update task status. Please try again.");
        }
    };

    // Render edit form if in editing mode
    if (isEditing) {
        return (
            <div className="task-item-editing">
            <form onSubmit={handleUpdate}>
            {error && <div className="error-message">{error}</div>}

                <div className="form-group">
        <label htmlFor="name">Task Name</label>
        <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        maxLength={25}
        className="form-input"
            />
            </div>

            <div className="form-group">
        <label htmlFor="description">Description</label>
            <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        maxLength={300}
        rows={3}
        className="form-textarea"
            />
            </div>

            <div className="form-row">
        <div className="form-group">
        <label htmlFor="status">Status</label>
            <select
        id="status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="form-select"
        >
        <option value="in_progress">In Progress</option>
        <option value="complete">Complete</option>
            </select>
            </div>

            <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
        type="text"
        id="dueDate"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        placeholder="mm/dd/yyyy"
        className="form-input"
            />
            </div>
            </div>

            <div className="form-actions">
        <button
            type="button"
        onClick={() => setIsEditing(false)}
        className="cancel-button"
        disabled={isUpdating}
            >
            Cancel
            </button>
            <button type="submit" className="save-button" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            </div>
            </form>
            </div>
    );
    }

        // Render normal view if not in edit mode
        return (
            <div className="task-item">
            <div className="task-header">
            <h3 className="task-title">{task.name}</h3>
                <span
        className={`task-status ${
            task.status === "complete" ? "task-status-complete" : "task-status-in-progress"
        }`}
    >
        {task.status === "complete" ? "Complete" : "In Progress"}
        </span>
        </div>

        <p className="task-description">{task.description}</p>

            <div className="task-footer">
        <span className="task-due-date">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</span>
        <div className="task-actions">
        <button
            onClick={handleToggleStatus}
        className="task-toggle-button"
        aria-label={`Mark task as ${
            task.status === "complete" ? "incomplete" : "complete"
        }`}
    >
        {task.status === "complete" ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button
        onClick={() => setIsEditing(true)}
        className="task-edit-button"
        aria-label="Edit task"
            >
            Edit
            </button>
            <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="task-delete-button"
        aria-label="Delete task"
            >
            {isDeleting ? "Deleting..." : "Delete"}
            </button>
            </div>
            </div>
        {error && <div className="error-message">{error}</div>}
            </div>
        );
        };

        export default TaskItem;