import { useEffect, useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import Task from './Task';
import { Text, Divider, FormLabel, FormControl, Select, Box, Center } from '@chakra-ui/react';
import './App.css';
import { fetchTasks } from './services/tasks';
// import {
//     startOfWeek,
//     endOfWeek,
//     addDays,
//     isToday,
//     isTomorrow,
//     isWithinInterval,
//     isAfter,
//     isPast,
// } from 'date-fns';
// import { ru } from 'date-fns/locale';

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
        tasks = sortTasks(tasks, sortOrder);
        //Сюда вставить группировку, как возможность, тоесть есть и сортировка и группировка.
        setTasks(tasks);
        console.log("обновление списка задач");
    }

    const sortTasks = (tasks, order) => {
        return [...tasks].sort((a, b) => {
            const dateA = new Date(a.dateOfFinish);
            const dateB = new Date(b.dateOfFinish);
            if (order === "asc") {
                return dateA.getTime() - dateB.getTime();
            }
            else {
                return dateB.getTime() - dateA.getTime();
            }
        });
    };


    return <div>
        <Box display="flex" alignItems="center" justifyContent="center" background={'yellow.400'} height={100}>
            <Text fontSize={42} fontWeight={'bold'} color={'white'}>MyNotes</Text>
        </Box>
        <section className='p8 flex flex-row justify-center items-start gap-12'>
            <div>
                <CreateTaskForm onAddTask={updateTasksListWithSort}></CreateTaskForm>
            </div>
            <Box p={6} border={"2px solid"} marginTop={5} borderColor={'gray.200'} borderRadius={"md"} boxShadow={"md"}>
                <ul>
                    <Text fontWeight={"bold"} className='font-weight-bold' fontSize={28}>Задачи:</Text>
                    {tasks.map((n) => (
                        <li key={n.id}>
                            <ul>
                                <Task title={n.title}
                                    description={n.description}
                                    dateOfFinish={n.dueDate}
                                    priority={n.priority}
                                    isCompleted={n.isCompleted}
                                    updateTasksList={updateTasksListWithSort}
                                    taskID={n.id} />
                            </ul>
                        </li>
                    ))}
                </ul>
            </Box>

        </section>
    </div>
}




