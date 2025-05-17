// Импорт различных библиотек для работы
import { useEffect, useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import Task from './Task';
import { Text, Divider, FormLabel, FormControl, Select, Box, Center,Stack } from '@chakra-ui/react';
import './App.css';
import { fetchTasks } from './services/tasks';
import { isToday, isTomorrow, isThisWeek, format, isYesterday, addWeeks, startOfWeek } from 'date-fns';
export default function App() {
    // Переменные для хранения состояний
    const [tasks, setTasks] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortType, setSortType] = useState('dateTimeOfExecution');
    const [groupType, setGroupType] = useState('noGroup');
    const [sortedTasks, setSortedTasks] = useState([]);
    const [groupedTasks, setGroupedTasks] = useState([]);
    const priorityOrder = ["Низкий", "Средний", "Высокий"];

    // Функция которая вызыается в случае изменения sortType или groupType
    useEffect(() => {
        updateTasksList();
    }, [sortType, groupType]);

    

    // Функция для подгрузки данных с базы данных
    const fetchData = async () => {
        let tasks = await fetchTasks();
        setTasks(tasks);
        console.log(tasks);
    }
    // Функция, которая группирует, а после сортирует полученные с базы задания
    const updateTasksList = async () => {
        let fetchedTasks = await fetchTasks();
        let filteredTasks = filterTasksByDate(fetchedTasks, groupType);
        let sortedTasks = sortTasksBySortType(filteredTasks, sortType);
        setGroupedTasks(sortedTasks);
    };
    // Функции для обработки изменения типа сортировки или группировки
    const onSwitchSortOrder = (e) => {
        setSortType(e.target.value);
    }

    const onSwitchGroupOrder = (e) => {
        setGroupType(e.target.value);
    }

    // Функция, которая сортирует задачи в соответствии с типом на входе
    const sortTasksBySortType = (tasks, sortType) => {
        let sortedTasks = [...tasks];
        switch (sortType) {
            case 'priority':
                sortedTasks.sort((a, b) => {
                    const priorityA = a.priority;
                    const priorityB = b.priority;
                    return priorityOrder.indexOf(priorityB) - priorityOrder.indexOf(priorityA);
                });
                break;
            case 'dateTimeOfExecution':
                console.log("Сортируем по dateTimeOfExecution");
                sortedTasks.sort((a, b) => {
                    const dateA = a.dateTimeOfExecution ? new Date(a.dateTimeOfExecution) : new Date(0);
                    const dateB = b.dateTimeOfExecution ? new Date(b.dateTimeOfExecution) : new Date(0);
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
            case 'dueDate':
                console.log("Сортируем по dueDate");
                sortedTasks.sort((a, b) => {
                    const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
                    const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
                    // Проверка на Invalid Date
                    if (isNaN(dateA.getTime())) {
                        console.warn("Некорректная дата:", a.dueDate);
                        return 1; // Считаем некорректную дату больше, чтобы она была в конце списка
                    }
                    if (isNaN(dateB.getTime())) {
                        console.warn("Некорректная дата:", b.dueDate);
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

    // Функция для того, чтобы отфильтровать задачи по категориям “Сегодня”, “Завтра”, “На этой неделе”, “Следующая неделя”
    const filterTasksByDate = (tasks, filterType) => {
        if (filterType === 'default') {
            return tasks; //  Возвращаем все задачи без фильтра
        }

        const filtered = tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            switch (filterType) {
                 case 'noGroup':
                    return true;
                case 'default':
                    return true;
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
                default:
                    return true;
            }
        });
        return filtered;
    };
    // Вспомогательная функция для получения следующей недели
    const getNextWeekStartDate = (date = new Date()) => {
        const nextWeekStart = addWeeks(startOfWeek(date, { weekStartsOn: 1 }), 1); // weekStartsOn: 1 - понедельник
        return nextWeekStart;
    };
    // Функция для проверки можно ли поставить задачу на следующую неделю в фильтрации
    const isTaskInNextWeek = (taskDate) => {
        const nextWeekStart = getNextWeekStartDate();
        const nextWeekEnd = addWeeks(nextWeekStart, 1); // Add one week to get the end date
        return taskDate >= nextWeekStart && taskDate < nextWeekEnd; // Check if the task date is within the next week's range
    };

    return <div>
        {/* Плашка главного меню сверху с логотипом */}
        <Box display="flex" alignItems="center" justifyContent="center" background={'yellow.400'} height={100}>
            <Text fontSize={42} fontWeight={'bold'} color={'white'}>MyNotes</Text>
        </Box>
        {/* Главная секция, которая содержит добавление и вывод задач */}
        <section className='p8 flex flex-row justify-center items-start gap-12'>
            {/* Форма для добавления задачи */}
            <div>
                <CreateTaskForm onAddTask={updateTasksList}></CreateTaskForm>
            </div>
            {/* Список с остортированными и сгруппированными задачами */}
            <Box style={{width: '700px', height: '700px', overflow: 'auto'}} p={6} border={"2px solid"} marginTop={5} borderColor={'gray.200'} borderRadius={"md"} boxShadow={"md"}>
                <Text fontWeight={"bold"} className='font-weight-bold' fontSize={28}>Задачи:</Text>
                <Stack direction={"row"}>
                    {/* Выбор сортировки */}
                <Select border={"2px solid black"} height={'25'} width={'230px'} borderRadius={'base'} _focus={{borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500",}} style={{ marginRight: "20px"}} value={sortType} onChange={onSwitchSortOrder}>
                    <option value="dateTimeOfExecution">По дате выполнения</option>
                    <option value="dueDate">По дате крайнего срока</option>
                    <option value="priority">По приоритету</option>
                </Select>
                {/* Выбор группировки */}
                <Select border={"2px solid black"} height={'25'} width={'230px'} borderRadius={"base"} _focus={{borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500",}} value={groupType} onChange={onSwitchGroupOrder}>
                    <option value="default">По умолчанию</option>
                    <option value="noGroup">Все</option>
                    <option value="Сегодня">Сегодня</option>
                    <option value="Завтра">Завтра</option>
                    <option value="На этой неделе">На этой неделе</option>
                    <option value="На следующей неделе">Следующая неделя</option>
                </Select>
                </Stack>
                
                {/* Задачи в виде карточек */}
                <ul>
                    {groupedTasks.map((n) => (
                        <li key={n.id}>
                            <ul>
                                <Task id={n.id} 
                                    title={n.title}
                                    description={n.description}
                                    dueDate={n.dueDate}
                                    priority={n.priority}
                                    dateTimeOfExecution={n.dateTimeOfExecution}
                                    isCompleted={n.isCompleted}
                                    category={n.category}
                                    updateTasksList={updateTasksList}
                                    />
                            </ul>
                        </li>
                    ))}
                </ul>
            </Box>

        </section>
    </div>
}




