// Импорт различных библиотек для работы
import { Input, Textarea, Button, Center, Text, Select, useToast, Box } from '@chakra-ui/react';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

// Русификация дат и календаря
registerLocale('ru', ru);
setDefaultLocale('ru'); 
export default function CreateTaskForm({ onAddTask }) {
    // Переменные для хранения состояний
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Средний');
    const [category, setCategory] = useState('');
    const [endDate, setEndDate] = useState(new Date());
    const toast = useToast();
    let isValid = true;

    // Обработчик создания задачи, отправляет запрос на сервер
    const handleCreateTask = async (event) => {
        event.preventDefault();
        validateForm();
        if (!isValid) {
            return;
        }
        
        console.log(title);
        const dataToAdd = {
            Title: title,
            Description: description,
            Priority: priority,
            Category: category,
            DueDate: endDate.toISOString(),
        }
        try {
            const response = await fetch(`https://localhost:7148/api/Tasks/addTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToAdd),
            });
            if (response.ok) {
                console.log('Задача успешно добавлена!');
                setTitle('');
                setDescription('');
                setPriority('');
                setCategory('');
                setPriority('Средний');
                const now = new Date();
                setEndDate(now);
                console.log(endDate);
                onAddTask();
                toast({title: 'Задача добавлена.'})
                
            }
            else {
                const errorText = await response.text();
                console.error('Ошибка при добавлении задачи: ' + errorText, response.status);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    // Обработчики полей для заполнения формы
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setTitleError(event.target.value ? '' : 'Название задачи обязательно для заполнения.');
    }
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }
    const handleTPriorityChange = (event) => {
        setPriority(event.target.value);
    }
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);

    }
    const handleDataChange = (date) => {
        setEndDate(date);
        setEndDateError(date ? '' : 'Дата обязательна для заполнения.')
        toast({ title: 'Конечный срок изменен.' });
    }
    
    // Функция для валидации полей формы
    const validateForm = () => {
        isValid = true;

        if (!title) {
            toast({ title: 'Название задачи обязательно для заполнения.' });
            isValid = false;
            return;
        }
        if (!endDate) {
            toast({ title: "Дата обязательна для заполнения." });
            isValid = false;
            return;
        }
    }

    return <div className='p8 flex flex-row justify-center items-start gap-12'>
        {/* Форма */}
        <form>
            <Box p={6} border={"2px solid"} marginTop={5} borderColor={'gray.200'} borderRadius={"md"} boxShadow={"md"}>
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={28} marginBottom={"7px"}>Добавить задачу:</Text>
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Введите название:</Text>
                <Input marginBottom={"7px"} placeholder='Название задачи' fontSize={21} value={title} onChange={handleTitleChange} ></Input>
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Введите описание</Text>
                <Textarea marginBottom={"7px"} placeholder='Описание' value={description} fontSize={21} onChange={handleDescriptionChange} />
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Выберите приоритет:</Text>
                <Select fontSize={21} marginBottom={"7px"} value={priority} onChange={handleTPriorityChange}>
                    <option fontSize={21} value={"Низкий"}>Низкий</option>
                    <option fontSize={21} value={"Средний"}>Средний</option>
                    <option fontSize={21} value={"Высокий"}>Высокий</option>
                </Select>
                <Text fontWeight={'bold'} className='font-weight-bold'  fontSize={21}>Введите категорию:</Text>
                <Input fontSize={21} marginBottom={"7px"} value={category} placeholder='Категория' onChange={handleCategoryChange} />
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Введите крайний срок:</Text>
                <Box marginBottom={"14px"} fontSize={21}>
                    <DatePicker className='font-semibold' selected={endDate} onChange={handleDataChange} showTimeSelect dateFormat="dd.MM.yyyy HH:mm" timeFormat='HH:mm' timeCaption='Время'>
                    </DatePicker>
                </Box>
                {/* Кнопка для отправки результата */}
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Button onClick={handleCreateTask} fontSize={21} width={150} color={'white'} backgroundColor={'yellow.400'}>Создать</Button>
                </Box>
            </Box>
        </form>
    </div>
} 