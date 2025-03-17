import mongoose from "mongoose";

export interface TaskInterface {
    _id: string;
    name: string;
    description: string;
    status: string;
    dueDate: Date;
}
//status option field
export enum taskStatus {
    IN_PROGRESS = "in_progress",
    COMPLETE = "complete",
}
const taskSchema = new mongoose.Schema({
    name: {type: String, required: true, maxlength: 25},
    description: {type: String, required: true, maxlength: 300},
    status: {type: String, enum: Object.values(taskStatus), required: true, default: "in_progress"},
    dueDate: {type: Date},
})

export default mongoose.models.Task || mongoose.model("Task", taskSchema);