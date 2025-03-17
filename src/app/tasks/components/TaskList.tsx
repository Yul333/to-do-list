"use client"

import axios from "axios";
import {useEffect, useState} from "react";
import TaskItem from "./TaskItem";

export type Task = {
    _id: string;
    name: string;
    description: string;
    status: "in_progress" | "complete";
    dueDate?: Date;
};

//temporary local state
const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    //fetches data from mongoDB API on first render
    useEffect(() => {
        fetchTasks();
    }, []);


        const fetchTasks = async () => {
            setIsLoading(true);
            try {
                //get from DB
                const {data} = await axios.get("api/tasks");
                //store in local state
                setTasks(data.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching tasks", error);
                setError("Failed to fetch tasks. Please try again.")
            } finally {
                setIsLoading(false);
            }
        };
        if (isLoading) {
            return <p>Loading tasks...</p>;
        }

        if (error) {
            return <p>{error}</p>;
        }

        return (
            <div>
                {tasks.length === 0 ? (
                    <p>No tasks here yet</p>
                ) : (
                    tasks.map((task) => <TaskItem key={task._id} task={task}/>)
                )}
            </div>
        );
    }
        export default TaskList;