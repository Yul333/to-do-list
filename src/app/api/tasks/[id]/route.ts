//get specific task by id
import {NextRequest, NextResponse} from "next/server";
import connectToMongoDb from "@/utils/mongoDb";
import Task from "@/models/Task";

//get task by id
export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        await connectToMongoDb()
        //extract id from params
        const taskId = params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            console.log("No task found");
            return NextResponse.json({error: "No task found"}, {status: 404});
        }
        return NextResponse.json(task, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error}, {status: 500});
    }
}

//delete task by id
export async function DELETE(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        await connectToMongoDb()
        const taskId = params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            console.log("No task found");
            return NextResponse.json({error: "No task found"}, {status: 404})
        }

        return NextResponse.json({message: "task deleted successfully"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error}, {status: 500})
    }
}

//handles put req. update existing task
export async function PUT(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        await connectToMongoDb()
        const taskId = params.id;
        //get and parse req body
        const updatedData = await req.json();
        //if req includes id, delete it (update id not allowed)
        if (updatedData._id) {
            delete updatedData._id;
        }
        //find and update and return new updated task
        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {new: true});
        if (!updatedTask) {
            console.log("No task found");
            return NextResponse.json({error: "No task found"})
        }
        return NextResponse.json(updatedTask, {status: 200});
    } catch (error) {
        console.error(error);
    }
}

