"use client";

import { useState } from "react";
import axios from "axios";
import { Task } from "../taskItem/TaskItem";

interface AddTaskProps {
    onTaskAdded: () => void;
}

// UI for creating new tasks
const AddTask = ({ onTaskAdded }: AddTaskProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form default values
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "in_progress",
        dueDate: "",
    });

    // Handles input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handles form submission (creating a new task)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // POST request to add a new task
            await axios.post("/api/tasks", formData);

            // Call parent callback to refresh task list
            onTaskAdded();
            setIsFormOpen(false);
            setFormData({ name: "", description: "", status: "in_progress", dueDate: "" }); // Reset form
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {!isFormOpen ? (
        <button onClick={() => setIsFormOpen(true)}>Add Task</button>
) : (
        <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Task Name" />
    <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Task Description"></textarea>
        <select name="status" value={formData.status} onChange={handleChange}>
    <option value="in_progress">In Progress</option>
    <option value="complete">Complete</option>
        </select>
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
    <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Task"}</button>
        <button type="button" onClick={() => setIsFormOpen(false)}>Cancel</button>
    </form>
)}
    </div>
);
};

export default AddTask;
