"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import TaskItem from "../taskItem/TaskItem";
import styles from "./TaskList.module.css";

export type Task = {
    _id: string;
    name: string;
    description: string;
    status: "in_progress" | "complete";
    dueDate?: string;
};

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //filter states
    const [statusFilter, setStatusFilter] = useState<"all" | "in_progress" | "complete">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTasks = async () => {
        try {
            const response = await axios.get("/api/tasks");
            const formattedTasks = response.data.map((task: any) => ({
                _id: task._id,
                name: task.name,
                description: task.description || "No description",
                status: task.status,
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
            }));

            const sortedTasks = formattedTasks.sort((a, b) => {
                const dateA = a.dueDate ? a.dueDate.getTime() : 0;
                const dateB = b.dueDate ? b.dueDate.getTime() : 0;
                return dateB - dateA;
            });

            setTasks(sortedTasks);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to load tasks. Please try again.");
            setIsLoading(false);
        }
    };

    //applies filters whenever tasks or filter conditions change
    useEffect(() => {
        let result = tasks;

        //filters by status
        if (statusFilter !== "all") {
            result = result.filter(task => task.status === statusFilter);
        }

        //filters by search query
        if (searchQuery) {
            result = result.filter(task =>
                task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredTasks(result);
    }, [tasks, statusFilter, searchQuery]);

    useEffect(() => {
        fetchTasks();
    }, []);

    if (isLoading) return <p>Loading tasks...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.taskListContainer}>
            <div className={styles.filtersContainer}>
                <div className={styles.filterItem}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "in_progress" | "complete")}
                        className={styles.filterSelect}
                    >
                        <option value="all">All Tasks</option>
                        <option value="in_progress">In Progress</option>
                        <option value="complete">Completed</option>
                    </select>
                </div>

                <div className={styles.filterItem}>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <p className={styles.noTasksMessage}>No tasks found</p>
            ) : (
                <div className={styles.tasksList}>
                    {filteredTasks.map((task) => (
                        <TaskItem key={task._id} task={task} onTaskUpdate={fetchTasks}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;