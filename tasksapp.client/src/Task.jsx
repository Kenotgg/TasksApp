import { useToast, Card,AlertDialog, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, FormControl,FormLabel,Input,ModalFooter,AlertDialogOverlay,AlertDialogContent,AlertDialogHeader,AlertDialogBody,AlertDialogFooter,Button, CardFooter, Spacer, Stack, CardHeader, Divider, CardBody, Text, AbsoluteCenter, Box, Checkbox, textDecoration, IconButton, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import React, { useRef } from 'react';

export default function Task({ title, description, dateOfFinish, priority, isCompleted: initialIsCompleted, updateTasksList, category, dateTimeOfExecution, taskID }) {
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(null);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null); // Состояние для хранения ID удаляемой задачи
    const cancelRef = React.useRef();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTaskData, setEditTaskData] = useState({
        id: taskID,
        title: title,
        description: description,
        dateOfFinish: dateOfFinish,
        priority: priority,
        category: category,
        isCompleted: isCompleted,
        dateTimeOfExecution: dateTimeOfExecution
         
    })
     

    let formattedDate;
    try {
        const date = new Date(dateOfFinish);
        formattedDate = format(date, 'День: dd, Месяц: MM, Год: yyyy. HH:mm.');
    } catch (error) {
        console.error("Error formatting date: ", error);
        formattedDate = "Invalid Date";
    }

    const toast = useToast();


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

    const handleUpdateTask = async () => {
        try {
            const response = await fetch(`https://localhost:7148/api/Tasks/${taskID}`, { // Замените URL
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
                <Flex>
                    <Spacer/>
                    <IconButton aria-label="Редактировать задачу"
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
                            <FormLabel>Дата выполнения</FormLabel>
                            <Input
                                name="dueDate"
                                value={editTaskData.dueDate}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        {/* ... другие поля ... */}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleUpdateTask}>
                            Сохранить
                        </Button>
                        <Button onClick={handleCloseEditModal}>Отмена</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
        </Card>
        
    )
};