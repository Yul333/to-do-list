"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./AddTask.module.css";

const AddTask = ({ onTaskAdded }: { onTaskAdded: () => void }) => {
    //state for form fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"in_progress" | "complete">("in_progress");
    const [dueDate, setDueDate] = useState("");

    //state for validation errors
    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
        dueDate?: string;
    }>({});

    //validates form before submission
    const validateForm = () => {
        const newErrors: {
            name?: string;
            description?: string;
            dueDate?: string;
        } = {};

        //name validation
        if (!name.trim()) {
            newErrors.name = "Task name is required";
        } else if (name.length > 50) {
            newErrors.name = "Task name must be 50 characters or less";
        }

        //description validation (optional, but with length limit)
        if (description.length > 200) {
            newErrors.description = "Description must be 200 characters or less";
        }

        //due date validation
        if (dueDate) {
            const selectedDate = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.dueDate = "Due date cannot be in the past";
            }
        }

        //updates errors state
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //handles creating a new task
    const handleSubmit = async (e: React.FormEvent) => {
        // Prevents the default form submission behavior
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            //make the API call with task details of new task
            await axios.post("/api/tasks", {
                name,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate) : null
            });


            setName("");
            setDescription("");
            setStatus("in_progress");
            setDueDate("");
            setErrors({}); // Clear errors after successful submission

            //notifies parent component about new task
            onTaskAdded();
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.addTaskForm}>
            <div className={styles.formGroup}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Task Name"
                    required
                    className={errors.name ? styles.inputError : styles.input}
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
            </div>

            <div className={styles.formGroup}>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task Description"
                    className={errors.description ? styles.textareaError : styles.textarea}
                />
                {errors.description && <p className={styles.errorText}>{errors.description}</p>}
            </div>

            <div className={styles.formGroup}>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "in_progress" | "complete")}
                    className={styles.select}
                >
                    <option value="in_progress">In Progress</option>
                    <option value="complete">Complete</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={errors.dueDate ? styles.inputError : styles.input}
                />
                {errors.dueDate && <p className={styles.errorText}>{errors.dueDate}</p>}
            </div>

            <div className={styles.formGroup}>
                <button
                    type="submit"
                    className={styles.addButton}
                >
                    Add Task
                </button>
            </div>

            <div className={styles.formGroup}>
                <button
                    type="button"
                    onClick={() => {
                        setName("");
                        setDescription("");
                        setStatus("in_progress");
                        setDueDate("");
                        setErrors({});
                    }}
                    className={styles.cancelButton}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};
export default AddTask;