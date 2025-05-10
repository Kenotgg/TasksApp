import {Input, Textarea, Button, Center, Text, Select, useToast,Box} from '@chakra-ui/react';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function CreateTaskForm({onAddTask}) {
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
        if(!isValid)
            {
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
        try{
            const response = await fetch(`https://localhost:7148/api/Tasks/addTask`,{
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToAdd),
            });
            console.log(response.status);
            if(response.ok){
                console.log('Задача успешно добавлена!');
                onAddTask();
            }
            else{
                const errorText = await response.text();
                console.error('Ошибка при добавлении задачи: ' + errorText, response.status);
            }
        }
        catch(error){
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
        toast ({title: "Изменяем дату"});
    }
    const validateForm = () => {
        isValid = true;

        if(!title){
            setTitleError('Название задачи обязательно для заполнения.');
            toast({title: titleError.toString()});
            isValid = false;
            return;
        }
        if(!endDate){
            setEndDateError('Дата обязательна для заполнения.');
            toast({title: endDateError.toString()});
            isValid = false;
            return;
        }
    }
    return <div className='p8 flex flex-row justify-center items-start gap-12'>
        <form>
            <Text fontWeight={'bold'} className='font-weight-bold text-xl'>Добавить задачу:</Text>
            <Text fontWeight={'bold'} className='font-weight-bold text-l'>Введите название:</Text>
            <Input marginBottom={"5px"} placeholder='Название задачи' onChange={handleTitleChange}></Input>
            <Text fontWeight={'bold'} className='font-weight-bold text-l'>Введите описание</Text>
            <Textarea marginBottom={"5px"} placeholder='Описание' onChange={handleDescriptionChange}/>
            <Text fontWeight={'bold'} className='font-weight-bold text-l'>Выберите приоритет:</Text>
            <Select marginBottom={"5px"} value={priority} onChange={handleTPriorityChange}>
                <option value={"Низкий"}>Низкий</option>
                <option value={"Средний"}>Средний</option>
                <option value={"Высокий"}>Высокий</option>
            </Select>
            <Text fontWeight={'bold'} className='font-weight-bold text-l'>Введите категорию:</Text>
            <Text fontWeight={'bold'} className='font-weight-bold text-l'>Введите "дедлайн":</Text>
            <Box>
            <DatePicker className='text-lg font-semibold' selected={endDate} onChange={handleDataChange} showTimeSelect dateFormat="dd.MM.yyyy HH:mm" timeFormat='HH:mm' timeCaption='Время'>
            </DatePicker>
            </Box>
            
            <Input marginBottom={"5px"} placeholder='Категория' onChange={handleCategoryChange}/>
            <Text fontWeight={'bold'} className='font-weight-bold text-l'></Text>
            <Button onClick={handleClick} size="xs" marginBottom={"5px"} color={'white'} backgroundColor={'teal'}>Создать</Button>
        </form>
    </div>
} 