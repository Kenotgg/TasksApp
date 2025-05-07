import { useEffect, useState } from 'react';
import './App.css';
import {Input, Textarea, Button} from '@chakra-ui/react';
export default function App() {
return <div className='p8 flex flex-row justify-center items-start gap-12'>
    <div>
        <form>
            <h3>Создание задачи:</h3>
            <Input placeholder='Название задачи'></Input>
            <Textarea placeholder='Описание'/>
            <Button color={'white'} backgroundColor={'teal'} size='xs'>Создать</Button>
        </form>
    </div>  
</div>
}

