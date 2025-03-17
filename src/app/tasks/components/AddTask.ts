// "use client"
//
// import {useState} from "react";
// import axios from "axios";
// import {Task} from "TaskItem";
//
// interface AddtaskProps {
//     onTaskAdded: () => void;
// }
//
// //UI for creating new tasks
//
// const AddTask = ({ onTaskAdded}: AddtaskProps) => {
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//
//     //form default values
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         status: "in_progress",
//         dueDate: Date,
//     });
//
//     //handles input changes
//     const handleChange = (e: React.ChangeEvent<Element>) => {
//         const { name, value } = e.target as HTMLInputElement;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };
//     //handles task update
//     const handleUpdate = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         try {
//             setIsEditing(true);
//
//             //PUT request to update task
//             await axios.put(`/api/tasks/${task._id}`, formData);
//
//             // Call parent callback to refresh task list
//             onTaskUpdated();
//             setIsEditing(false);
//         } catch (error) {
//             console.error("Error updating task:", error);
//             alert("Failed to update task. Please try again.");
//             setIsEditing(false);
//         }
//     };
// }