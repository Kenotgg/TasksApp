import { useEffect, useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import Task from './Task';
import { Text, Divider, FormLabel, FormControl, Select, Box, Center } from '@chakra-ui/react';
import './App.css';
import { fetchTasks } from './services/tasks';
import { isToday, isTomorrow, isThisWeek, format, isYesterday, addWeeks, startOfWeek } from 'date-fns';
export default function App() {
    const [tasks, setTasks] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortType, setSortType] = useState('completion');
    const [groupType, setGroupType] = useState('Сегодня');
    const [sortedTasks, setSortedTasks] = useState([]);
    const [groupedTasks, setGroupedTasks] = useState([]);
    const priorityOrder = ["Низкий", "Средний", "Высокий"];


    useEffect(() => {
       updateTasksList();
    }, [sortType, groupType]);

    const fetchData = async () => {
        let tasks = await fetchTasks();
        setTasks(tasks);
        console.log(tasks);
    }

    const updateTasksList = async () => {
        let fetchedTasks = await fetchTasks();
        let filteredTasks = filterTasksByDate(fetchedTasks, groupType);
        let sortedTasks = sortTasksBySortType(filteredTasks, sortType);
        setGroupedTasks(sortedTasks);
    };

    const updateTasksListWithSort = async () => {
        console.log(sortType);
        let fetchedTasks = await fetchTasks();
        let sortedTasks = sortTasksBySortType(fetchedTasks, sortType);
        setSortedTasks(sortedTasks);
        setTasks(sortedTasks);
        console.log("обновление списка задач");
    }

    const updateTasksListWithGroup = async () => {
        console.log(sortType);
        let fetchedTasks = await fetchTasks();
        let groupedTasks = filterTasksByDate(fetchedTasks, groupType);
        setGroupedTasks(groupedTasks);
        setTasks(groupedTasks);
        console.log("обновление списка группированных задач");
    }

    const onSwitchSortOrder = (e) => {
        console.log(e.target.value);
        setSortType(e.target.value);
    }

    const onSwitchGroupOrder = (e) => {
        console.log(e.target.value);
        setGroupType(e.target.value);
    }

    const sortTasksBySortType = (tasks, sortType) => {
        console.log(sortType);
        let sortedTasks = [...tasks];

        switch (sortType) {
            case 'priority':
                sortedTasks.sort((a, b) => {
                    const priorityA = a.priority;
                    const priorityB = b.priority;
                    return priorityOrder.indexOf(priorityB) - priorityOrder.indexOf(priorityA);
                });
                break;
            case 'completion':
                console.log("Сортируем по completion");
                sortedTasks.sort((a, b) => {
                    const dateA = a.dateTimeOfExecution ? new Date(a.dateTimeOfExecution) : new Date(0); // Если нет, ставим 0 (1970)
                    const dateB = b.dateTimeOfExecution ? new Date(b.dateTimeOfExecution) : new Date(0);
                    console.log(a.dateTimeOfExecution);
                    // Проверка на Invalid Date
                    if (isNaN(dateA.getTime())) {
                        console.warn("Некорректная дата:", a.dateTimeOfExecution);
                        return 1; // Считаем некорректную дату больше, чтобы она была в конце списка
                    }
                    if (isNaN(dateB.getTime())) {
                        console.warn("Некорректная дата:", b.dateTimeOfExecution);
                        return -1; // Считаем некорректную дату больше, чтобы она была в конце списка
                    }

                    return dateB.getTime() - dateA.getTime(); // Сортировка по убыванию (от новых к старым)
                });
                break;
            case 'default':
                break;
        };
        return sortedTasks;
    }


    const filterTasksByDate = (tasks, filterType) => {
        if (filterType === 'default') {
            return tasks; //  Возвращаем все задачи без фильтра
        }

        const filtered = tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            switch (filterType) {
                case 'Сегодня':
                    return isToday(taskDate);
                case 'Завтра':
                    return isTomorrow(taskDate);
                case 'Вчера':
                    return isYesterday(taskDate);
                case 'На этой неделе':
                    return isThisWeek(taskDate);
                case 'На следующей неделе':
                    return isTaskInNextWeek(taskDate);
                case 'default':
                    return true;
                default:
                    return true; // No filter
            }
        });
        return filtered;
    };

    const getNextWeekStartDate = (date = new Date()) => {
        const nextWeekStart = addWeeks(startOfWeek(date, { weekStartsOn: 1 }), 1); // weekStartsOn: 1 - понедельник
        return nextWeekStart;
    };

    const isTaskInNextWeek = (taskDate) => {
        const nextWeekStart = getNextWeekStartDate();
        const nextWeekEnd = addWeeks(nextWeekStart, 1); // Add one week to get the end date
        return taskDate >= nextWeekStart && taskDate < nextWeekEnd; // Check if the task date is within the next week's range
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
                <Text fontWeight={"bold"} className='font-weight-bold' fontSize={28}>Задачи:</Text>

                <select value={sortType} onChange={onSwitchSortOrder}>
                    <option value="completion">По дате выполнения</option>
                    <option value="priority">По приоритету</option>
                </select>

                <select value={groupType} onChange={onSwitchGroupOrder}>
                    <option value="default">По умолчанию</option>
                    <option value="Сегодня">Сегодня</option>
                    <option value="Завтра">Завтра</option>
                    <option value="На этой неделе">На этой неделе</option>
                    <option value="На следующей неделе">Следующая неделя</option>
                </select>

                <ul>
                    {groupedTasks.map((n) => (
                        <li key={n.id}>
                            <ul>
                                <Task title={n.title}
                                    description={n.description}
                                    dueDate={n.dueDate}
                                    priority={n.priority}
                                    dateTimeOfExecution={n.dateTimeOfExecution}
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




