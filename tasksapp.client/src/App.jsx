// Импорт различных библиотек для работы
import { useEffect, useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import Task from './Task';
import { Text, Divider, FormLabel, FormControl, Select, Box, Center } from '@chakra-ui/react';
import './App.css';
import { fetchTasks } from './services/tasks';
import { isToday, isTomorrow, isThisWeek, format, isYesterday, addWeeks, startOfWeek } from 'date-fns';
export default function App() {
    // Переменные для хранения состояний
    const [tasks, setTasks] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortType, setSortType] = useState('completion');
    const [groupType, setGroupType] = useState('default');
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
            case 'completion':
                console.log("Сортируем по completion");
                sortedTasks.sort((a, b) => {
                    const dateA = a.dateTimeOfExecution ? new Date(a.dateTimeOfExecution) : new Date(0); // Если нет, ставим 0 (1970)
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
            <Box p={6} border={"2px solid"} marginTop={5} borderColor={'gray.200'} borderRadius={"md"} boxShadow={"md"}>
                <Text fontWeight={"bold"} className='font-weight-bold' fontSize={28}>Задачи:</Text>
                {/* Выбор сортировки */}
                <select style={{ marginRight: "20px" }} value={sortType} onChange={onSwitchSortOrder}>
                    <option value="completion">По дате выполнения</option>
                    <option value="priority">По приоритету</option>
                </select>
                {/* Выбор группировки */}
                <select value={groupType} onChange={onSwitchGroupOrder}>
                    <option value="default">По умолчанию</option>
                    <option value="Сегодня">Сегодня</option>
                    <option value="Завтра">Завтра</option>
                    <option value="На этой неделе">На этой неделе</option>
                    <option value="На следующей неделе">Следующая неделя</option>
                </select>
                {/* Задачи в виде карточек */}
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
                                    category={n.category}
                                    updateTasksList={updateTasksList}
                                    taskID={n.id} />
                            </ul>
                        </li>
                    ))}
                </ul>
            </Box>

        </section>
    </div>
}




