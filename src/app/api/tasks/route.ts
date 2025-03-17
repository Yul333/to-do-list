//get all tasks
import {NextRequest, NextResponse} from "next/server";
import connectToMongoDb from "@/utils/mongoDb";
import Task from "@/models/Task";

//get request handler that fetches all tasks from DB
export async function GET(req: NextRequest) {

    try{
    //connect to DB
         await connectToMongoDb()
        //find all tasks
        const tasks = await Task.find();
         //handle cases when no tasks exist
        if(!tasks || tasks.length === 0){
            console.log("No tasks found");
            return NextResponse.json({error: "No tasks found"}, {status: 404});
        }
        //successfully returned tasks list
        return NextResponse.json(tasks, {status: 200});
    }
    catch(err){
        console.log("error fetching tasks", err);
        return NextResponse.json({error: err}, {status: 500});
    }
}

//handles post requests - create new task
export async function POST(req: NextRequest) {
    try {
        await connectToMongoDb()
        //get and parse req body
        const body = await req.json();
        const {name, description, status, dueDate} = body;
        //validation fields
        if(!name || !description){
            return NextResponse.json({error: "Missing name or description"}, {status: 400});
        }
        //create new task
        const newTask = await Task.create({name, description, status, dueDate});
        console.log(newTask);
        return NextResponse.json(newTask, {status: 201});
    }
    catch(err){
        console.log("error adding new task", err);
        return NextResponse.json({ error: err.message || "Failed to create task" }, { status: 500 });
    }
}


