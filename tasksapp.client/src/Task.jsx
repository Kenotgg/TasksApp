import { useToast, Card,Select, AlertDialog, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, FormControl, FormLabel, Input, ModalFooter, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, CardFooter, Spacer, Stack, CardHeader, Divider, CardBody, Text, AbsoluteCenter, Box, Checkbox, textDecoration, IconButton, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import React, { useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
import { registerLocale, setDefaultLocale } from 'react-datepicker'; // Correct Import
export default function Task({ title, description, priority, dueDate, isCompleted: initialIsCompleted, updateTasksList, category, dateTimeOfExecution, taskID }) {
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(null);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null); // Состояние для хранения ID удаляемой задачи
    const cancelRef = React.useRef();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [endDate, setEndDate] = useState(() => {
        const now = new Date();
        const currentDay = now.getDay();
        now.setDate(currentDay + 7);
        now.setSeconds(0, 0);
        return now;
    });
     const [endDateError, setEndDateError] = useState('');
     const [titleError, setTitleError] = useState('');
    const [editTaskData, setEditTaskData] = useState({
        id: taskID,
        title: title,
        description: description,
        priority: priority,
        category: category,
        isCompleted: isCompleted,
        dueDate: dueDate,
        dateTimeOfExecution: dateTimeOfExecution
    })
    const toast = useToast();

     const handleDataChange = (date) => {
        setEndDate(date);
        setEndDateError(date ? '' : 'Дата обязательна для заполнения.')
        toast({ title: "Изменяем дату" });
    }
    const formatDate = (inputDate) => {
        if (!inputDate) {
        return "Дата не указана"; // Или другое сообщение по умолчанию
    }
        try {
            const date = new Date(inputDate);
            const formattedDate = format(date, 'dd день MM месяц yyyy год в HH часов и mm минут.')
            return formattedDate;
        } catch (error) {
            console.error("Error formatting date: ", error);
            return "Invalid Date";
        }
    }

    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleInputChange = (e) => {
        setEditTaskData({
            ...editTaskData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditTask = async () => {
        try {
            const response = await fetch(`https://localhost:7148/api/Tasks/editTask?id=${editTaskData.id}&title=${editTaskData.title}&category=${editTaskData.category}&priority=${editTaskData.priority}&description=${editTaskData.description}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editTaskData),
            });

            if (response.ok) {
                console.log("Задача успешно обновлена.");
                toast({
                    title: "Задача успешно обновлена.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                updateTasksList();
            } else {
                const errorMessage = await response.text();
                console.error(`Ошибка при обновлении задачи: ${response.status} - ${errorMessage}`);
                toast({
                    title: "Ошибка при обновлении задачи.",
                    description: errorMessage || "Не удалось обновить задачу.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Произошла ошибка при отправке запроса:", error);
            toast({
                title: "Ошибка при обновлении задачи.",
                description: "Произошла ошибка при отправке запроса.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            handleCloseEditModal();
        }
    };

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
            }

        } catch (error) {
            console.log(error);
        }
    }
    const handleOpenDeleteDialog = (id) => {
        setIsDeleteDialogOpen(true);
        setTaskIdToDelete(id);
    }

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setTaskIdToDelete(null); // Сбрасываем ID
    };
    const handleDeleteTask = async () => {
        try {
            const response = await fetch(`https://localhost:7148/api/Tasks/removeTask?id=${taskIdToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Задача успешно удалена!");
                toast({
                    title: "Задача успешно удалена!"
                });
                updateTasksList();
            } else {
                const errorMessage = await response.text;
                console.error(`Ошибка при удалении задачи: ${response.status} - ${errorMessage}`);
                toast({
                    title: "Ошибка при удалении задачи."
                });

            }
        } catch (error) {
            console.error("Произошла ошибка при отправке запроса", error);
            toast({
                title: "Ошибка при удалении задачи.",
            });
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
                <Text fontWeight={"bold"} fontSize={24} >{title + ':'}</Text>
            </CardHeader>
            <Box position='relative' padding='1'>
                <Divider />
            </Box>
            <CardBody>
                <Text fontSize={21}>{description}</Text>
                <Text color={'gray.600'} fontSize={17}>{'Выполнить до: ' + formatDate(dueDate)}</Text>
                <Text color={'gray.600'} fontSize={17}>{'Готово в: ' + formatDate(dateTimeOfExecution)}</Text>
                <Text color={'gray.600'} fontSize={17}>Приоритет: {priority + '.'}</Text>
                <Stack marginTop={3}>
                    <Flex>
                        <Checkbox size={'lg'} isChecked={isCompleted} onChange={handleCheckBoxChange}></Checkbox>
                        <Spacer />
                        <IconButton marginRight={1} aria-label="Редактировать задачу"
                            onClick={handleOpenEditModal}
                            icon={<EditIcon />}
                            size="sm">
                        </IconButton>
                        <IconButton aria-label="Удалить задачу"
                            onClick={() => handleOpenDeleteDialog(taskID)}
                            icon={<DeleteIcon />}
                            size="sm">
                        </IconButton>
                    </Flex>
                </Stack>



            </CardBody>
            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={handleCloseDeleteDialog}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Удалить задачу
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены, что хотите удалить эту задачу?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={handleCloseDeleteDialog}>
                                Отмена
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteTask} ml={3}>
                                Удалить
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* Отказаться от этого способа обработки данных в форме, сделать нормальный */}
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Редактировать задачу</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Заголовок</FormLabel>
                        <Input
                            name="title"
                            value={editTaskData.title}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Описание</FormLabel>
                        <Input
                            name="description"
                            value={editTaskData.description}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Приоритет</FormLabel>
                        <Select
                            name="priority"
                            value={editTaskData.priority}
                            onChange={handleInputChange}
                            fontSize={21}
                            marginBottom={"7px"}
                        >
                            <option value={"Низкий"}>Низкий</option>
                            <option value={"Средний"}>Средний</option>
                            <option value={"Высокий"}>Высокий</option>
                        </Select>
                    </FormControl>
                    {/*<FormControl mt={4}>
                        <FormLabel>Категория</FormLabel>
                        // TODO: Implement category selection
                    </FormControl>*/}
                    <FormControl mt={4}>
                        <FormLabel>Дата выполнения</FormLabel>
                        {/* <Input
                            name="dueDate"
                            value={formatDate(editTaskData.dueDate)}  // Использовать функцию форматирования
                            onChange={handleInputChange}
                        /> */}
                        <Box marginBottom={"14px"} fontSize={21}>
                                            <DatePicker className='font-semibold' selected={endDate} onChange={handleDataChange} showTimeSelect dateFormat="dd.MM.yyyy HH:mm" timeFormat='HH:mm' timeCaption='Время'>
                                            </DatePicker>
                                        </Box>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Крайний срок</FormLabel>
                        <Input
                            name="dateTimeOfExecution"
                            value={formatDate(editTaskData.dateTimeOfExecution)}  // Использовать функцию форматирования
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleEditTask}>
                        Сохранить
                    </Button>
                    <Button onClick={handleCloseEditModal}>Отмена</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        </Card>

    )
};