import { useToast, Card, CardFooter, Stack, CardHeader, Divider, CardBody, Text, AbsoluteCenter, Box, Checkbox, textDecoration } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState } from 'react';
export default function Task({ title, description, dateOfFinish, priority, isCompleted: initialIsCompleted, updateTasksList, taskID }) {
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    let formattedDate;
    try {
        const date = new Date(dateOfFinish);
        formattedDate = format(date, 'День: dd, Месяц: MM, Год: yyyy. HH:mm.');
    } catch (error) {
        console.error("Error formatting date: ", error);
        formattedDate = "Invalid Date";
    }

    const toast = useToast();
    const handleCheckBoxChange = async (event) => {
        const newIsCompleted = event.target.checked;
        setIsCompleted(newIsCompleted);
        try {
            const response = await fetch(`https://localhost:7148/api/Tasks/EditTaskCompletion?id=${taskID}&isCompleted=${newIsCompleted}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isCompleted: newIsCompleted }),
            });
            if (response.ok) {
                console.log("Статус успешно обновлен.");
                // toast({
                //     title: "Статус выполнения успешно обновлен.",
                // });

            }

        } catch (error) {
            console.log(error);
        }
        

    }

    const cardStyle = {
        backgroundColor: isCompleted ? 'lightgray' : 'white',
        color: 'black',
        textDecoration: isCompleted ? 'line-through' : 'none',
    };
    return (
        <Card style={cardStyle} marginTop={5}>
            <CardHeader>
                <Text fontWeight={"bold"} fontSize={"lg"} >{title + ':'}</Text>
            </CardHeader>
            <Box position='relative' padding='1'>
                <Divider />
                <AbsoluteCenter bg={cardStyle} px='2'>
                    <Text style={cardStyle}>Описание</Text>
                </AbsoluteCenter>
            </Box>
            <CardBody>
                <Text>{description}</Text>
                <Text>Приоритет: {priority + '.'}</Text>
                <Text>{'Дедлайн: ' + formattedDate}</Text>
                <Text>{'Время выполнения: ' + formattedDate}</Text>
                <Stack direction="row">
                <Text>Состояние выполнения:</Text>
                <Checkbox isChecked={isCompleted} onChange={handleCheckBoxChange}></Checkbox>
                </Stack>
               
            </CardBody>
        </Card>
    )
};