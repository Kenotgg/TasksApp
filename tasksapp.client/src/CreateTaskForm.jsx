import { Input, Textarea, Button, Center, Text, Select, useToast, Box } from '@chakra-ui/react';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
import { registerLocale, setDefaultLocale } from 'react-datepicker'; // Correct Import

registerLocale('ru', ru);
setDefaultLocale('ru'); // Устанавливаем русскую локаль по умолчанию
export default function CreateTaskForm({ onAddTask }) {
    //Состояния полей формы.
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Средний');
    const [category, setCategory] = useState('');
    //Состояния ошибок.
    const [titleError, setTitleError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const toast = useToast();

    const [endDate, setEndDate] = useState(() => {
        const now = new Date();
        const currentDay = now.getDay();
        now.setDate(currentDay + 7);
        now.setSeconds(0, 0);
        return now;
    });
    let isValid = true;
    const handleClick = async (event) => {
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
            DueDate: endDate.toISOString()
        }
        try {
            const response = await fetch(`https://localhost:7148/api/Tasks/addTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToAdd),
            });
            console.log(response.status);
            if (response.ok) {
                console.log('Задача успешно добавлена!');
                onAddTask();
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
        toast({ title: "Изменяем дату" });
    }
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
        <form>
            <Box p={6} border={"2px solid"} marginTop={5} borderColor={'gray.200'} borderRadius={"md"} boxShadow={"md"}>
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={28} marginBottom={"7px"}>Добавить задачу:</Text>
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Введите название:</Text>
                <Input marginBottom={"7px"} placeholder='Название задачи' fontSize={21} onChange={handleTitleChange} ></Input>
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Введите описание</Text>
                <Textarea marginBottom={"7px"} placeholder='Описание' fontSize={21} onChange={handleDescriptionChange} />
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Выберите приоритет:</Text>
                <Select fontSize={21} marginBottom={"7px"} value={priority} onChange={handleTPriorityChange}>
                    <option fontSize={21} value={"Низкий"}>Низкий</option>
                    <option fontSize={21} value={"Средний"}>Средний</option>
                    <option fontSize={21} value={"Высокий"}>Высокий</option>
                </Select>
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Введите категорию:</Text>
                <Input fontSize={21} marginBottom={"7px"} placeholder='Категория' onChange={handleCategoryChange} />
                <Text fontWeight={'bold'} className='font-weight-bold' fontSize={21}>Введите крайний срок:</Text>
                <Box marginBottom={"14px"} fontSize={21}>
                    <DatePicker className='font-semibold' selected={endDate} onChange={handleDataChange} showTimeSelect dateFormat="dd.MM.yyyy HH:mm" timeFormat='HH:mm' timeCaption='Время'>
                    </DatePicker>
                </Box>
                <Text fontWeight={'bold'} className='font-weight-bold text-l'></Text>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Button onClick={handleClick} fontSize={21} width={150} color={'white'} backgroundColor={'yellow.400'}>Создать</Button>
                </Box>
            </Box>
        </form>
    </div>
} 