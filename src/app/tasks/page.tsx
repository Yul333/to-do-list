import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";


export default function (){
    return (
        <div>
            <h1>To-D0-List</h1>
            <AddTask />
            <TaskList />
        </div>
    );
}