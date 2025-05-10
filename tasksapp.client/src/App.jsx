import { useEffect, useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import Task from './Task';
import {Text, Divider} from '@chakra-ui/react';
import './App.css';
import { fetchTasks } from './services/tasks';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    useEffect(() => {
        fetchData();
        updateTasksListWithSort();
    }, []);
     const fetchData = async () => {
            let tasks = await fetchTasks();
            setTasks(tasks);
            console.log(tasks);
        }


    const updateTasksListWithSort = async () => {
        let tasks = await fetchTasks();
        tasks = sortTasks(tasks,sortOrder);
        setTasks(tasks);
        console.log("обновление списка задач");
    }

    const sortTasks = (tasks, order) => {
        return [...tasks].sort((a, b) => {
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
            if (order === "asc") {
                return dateA.getTime() - dateB.getTime();
            }
            else {
                return dateB.getTime() - dateA.getTime();
            }
        });
    };
    return <section className='p8 flex flex-row justify-center items-start gap-12'>
        <div>
            <CreateTaskForm onAddTask={updateTasksListWithSort}></CreateTaskForm>
        </div>
      
        <ul>
        <Text fontWeight={"bold"} className='font-weight-bold text-xl'>Задачи:</Text>
            {tasks.map((n) => (
                <li key={n.id}>
                    <ul>
                        <Task title={n.title}
                            description={n.description}
                            dateOfFinish={n.dueDate}
                            priority={n.priority}
                            isCompleted={n.isCompleted}
                            updateTasksList={updateTasksListWithSort}
                            taskID = {n.id} />
                    </ul>
                </li>
            ))}

        </ul>
    </section>
}




