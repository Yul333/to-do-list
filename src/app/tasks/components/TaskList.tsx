"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import TaskItem from "./taskItem/TaskItem";

export type Task = {
    _id: string;
    name: string;
    description: string;
    status: "in_progress" | "complete";
    dueDate?: string;
};

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("/api/tasks");
            console.log("API Response:", response.data);

            if (!response.data || !response.data) {
                throw new Error("Invalid response format");
            }

            const formattedTasks = response.data.map((task: any) => ({
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : "",
            }));

            setTasks(formattedTasks);
            setError(null);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to load tasks. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchTasks();
    }, []);

    //show loading state
    if (isLoading) {
        return <p>Loading tasks...</p>;
    }

    //show error state
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {tasks.length === 0 ? (
                <p>No tasks here yet</p>
            ) : (
                tasks.map((task) => (
                    <TaskItem key={task._id} task={task} onTaskUpdate={fetchTasks} />
                ))
            )}
        </div>
    );
};

export default TaskList;
