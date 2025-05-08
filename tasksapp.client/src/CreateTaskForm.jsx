import {Input, Textarea, Button, Center, Text} from '@chakra-ui/react';
import { useState } from 'react';
export default function CreateTaskForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState('');

    const handleTitleChange = () => {
        setTitle(title);
        console.log(title);
    }
    const handleDescriptionChange = () => {
        setDescription(description);
    }
    const handleTPriorityChange = () => {
        setPriority(priority);
    }
    const handleCategoryChange = () => {
        setCategory(category);
    }
    
    

    const handleClick = async (event) => {
        event.preventDefault();
        
        const dataToAdd = {
            Title: title,
            Description: description,
            Priority: priority,
            Category: category
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


    return <div className='p8 flex flex-row justify-center items-start gap-12'>
        <form>
            <Text fontWeight={'bold'} className='font-weight-bold text-xl'>Добавить задачу:</Text>
            <Input marginBottom={"5px"} placeholder='Название задачи' onChange={handleTitleChange}></Input>
            <Textarea marginBottom={"5px"} placeholder='Описание' onChange={handleDescriptionChange}/>
            <Input marginBottom={"5px"} placeholder='Приоритет' onChange={handleTPriorityChange}/>
            <Input marginBottom={"5px"} placeholder='Категория' onChange={handleCategoryChange}/>
            <Button onClick={handleClick} size="xs" marginBottom={"5px"} color={'white'} backgroundColor={'teal'}>Создать</Button>
        </form>
    </div>
} 