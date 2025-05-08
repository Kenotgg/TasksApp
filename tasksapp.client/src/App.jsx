import { useEffect, useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import Task from './Task';
import {Text} from '@chakra-ui/react';
import './App.css';
import { fetchTasks } from './services/tasks';
export default function App() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let tasks = await fetchTasks();
            setTasks(tasks);
            console.log(tasks);
        }
        fetchData();
    }, []);

    return <section className='p8 flex flex-row justify-center items-start gap-12'>
        <div>
            <CreateTaskForm></CreateTaskForm>
        </div>
        {/* <div>Фильтры</div> */}

        <ul>
        <Text fontWeight={"bold"} className='font-weight-bold text-xl'>Задачи:</Text>
            
            {tasks.map((n) => (
                <li key={n.id}>
                    <ul>
                        <Task title={n.title}
                            description={n.description}
                            createdAt={n.createdAt} />
                    </ul>
                </li>
            ))}

        </ul>
    </section>
}




