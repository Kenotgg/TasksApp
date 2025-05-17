// Импорт различных библиотек для работы
import { useToast, Card, Select, AlertDialog, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, FormControl, FormLabel, Input, ModalFooter, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, CardFooter, Spacer, Stack, CardHeader, Divider, CardBody, Text, AbsoluteCenter, Box, Checkbox, textDecoration, IconButton, Flex } from '@chakra-ui/react';
import { format, isValid, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import React, { useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Русификация дат и календаря
import ru from 'date-fns/locale/ru';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

export default function Task({ title, description, priority, dueDate, dateTimeOfExecution, isCompleted: initialIsCompleted, updateTasksList, category, id }) {
    // Переменные для хранения состояний
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(null);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null); // Состояние для хранения ID удаляемой задачи
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const toast = useToast();
    const cancelRef = React.useRef();
    // Состояния для ошибок
    const [endDateError, setEndDateError] = useState('');
    const [titleError, setTitleError] = useState('');
    // Состояния для хранения даты при редактировании
    // const [executionDate, setexecutionDate] = useState(() => {
    //     const now = new Date();
    //     const currentDay = now.getDay();
    //     now.setDate(currentDay + 7);
    //     now.setSeconds(0, 0);
    //     return now;
    // });

     const [executionDate, setexecutionDate] = useState(null);
     const [endDate, setEndDate] = useState(null);
     useEffect(() => {
         const setDate = (dateString, setter) => {
      if (dateString) {
        try {
          const parsedDate = parseISO(dateString);
          if (isValid(parsedDate)) {
            setter(parsedDate);
          } else {
            console.error("Невалидная дата:", dateString);
            setter(null);
          }
        } catch (error) {
          console.error("Ошибка при преобразовании даты:", error);
          setter(null);
        }
      } else {
        setter(null);
      }
    };

    // Устанавливаем даты при загрузке формы
    setDate(dueDate, setEndDate);
    setDate(dateTimeOfExecution, setexecutionDate);
  }, [dueDate, dateTimeOfExecution]); // Зависимости от пропсов
    // const [endDate, setEndDate] = useState(() => {
    //     const now = new Date();
    //     const currentDay = now.getDay();
    //     now.setDate(currentDay + 7);
    //     now.setSeconds(0, 0);
    //     return now;
    // });

    //  const [endDate, setEndDate] = useState(() => {
    //     const now = new Date();
    //     const currentDay = now.getDay();
    //     now.setDate(currentDay + 7);
    //     now.setSeconds(0, 0);
    //     return now;
    // });

//     useEffect(() => {
//     setEndDate(dueDate);
//   }, []);
//    useEffect(() => {
//     setexecutionDate(dateTimeOfExecution);
//   }, []); 

    // Данные задачи при редактировании
    const [editTaskData, setEditTaskData] = useState({
        id: id,
        title: title,
        description: description,
        priority: priority,
        category: category,
        isCompleted: isCompleted,
        dueDate: dueDate,
        dateTimeOfExecution: dateTimeOfExecution
    })

    const handleEndDateDataChange = (date) => {
        setEndDate(date);
        setEndDateError(date ? '' : 'Дата обязательна для заполнения.')
        // toast({ title: "Изменяем дату" });
        updateTasksList();
    }

     const handleExecutionDataChange = (date) => {
        setexecutionDate(date);
        setEndDateError(date ? '' : 'Дата обязательна для заполнения.')
        // toast({ title: "Изменяем дату" });
        updateTasksList();
    }

    // Функция возвращающая отформатированную дату
    const formatDate = (inputDate) => {
        if (!inputDate) {
            return "Дата не указана"; // Или другое сообщение по умолчанию
        }
        try {
            const date = new Date(inputDate);
            const formattedDate = format(date, 'dd.MM.yyyy HH:mm.')
            return formattedDate;
        } catch (error) {
            console.error("Error formatting date: ", error);
            return "Invalid Date";
        }
    }

    // Функции для открытия закрытия модального окна редактирования
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

    // Функция отправляющая запрос на изменение задачи на сервер с входными параметрами
    const handleEditTask = async (event) => {
        event.preventDefault();
         console.log(id + "Task ID");
    //     const dataForEdit = {
    // Title: title, // Начинаем с большой буквы
    // Description: description,
    // DueDate: dueDate.toISOString(),
    // DateTimeOfExecution: DateTimeOfExecution.toISOString(), 
    // Priority: priority,
    // Category: category,
    // IsCompleted: false,
    // Id: taskID // Добавляем Id
    //     }

        //if (endDate && isValid(endDate)
const dueDateToAdd = endDate.toISOString();
const executionDateToAdd = executionDate.toISOString();
        try {
            const response = await fetch(`https://localhost:7148/api/Tasks/editTask?id=${id}&title=${editTaskData.title}&category=${editTaskData.category}&priority=${editTaskData.priority}&description=${editTaskData.description}&dueDate=${dueDateToAdd}&dateTimeOfExecution=${executionDateToAdd}`, {
                method: 'PUT',
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

    // Функция отправляющая запрос на смену состояния выполнения задачи
    const handleCheckBoxChange = async (event) => {
        const newIsCompleted = event.target.checked;
        setIsCompleted(newIsCompleted);
        try {
            const response = await fetch(`https://localhost:7148/api/Tasks/EditTaskCompletion?id=${id}&isCompleted=${newIsCompleted}`, {
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

    // Функции для открытия и закрытия диалога удаления
    const handleOpenDeleteDialog = (id) => {
        setIsDeleteDialogOpen(true);
        setTaskIdToDelete(id);
    }

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setTaskIdToDelete(null); // Сбрасываем ID
    };

    // Функция отправляющая на сервер запрос для удаления
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

    // Стиль для карточки в зачеркнутом и не зачеркнутом виде
    const cardStyle = {
        backgroundColor: isCompleted ? 'lightgray' : 'white',
        color: 'black',
        textDecoration: isCompleted ? 'line-through' : 'none',
    };

    return (
        // Карточка со всей информацией о заметке
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
                {isCompleted && (
                    <Text color={'gray.600'} fontSize={17}>{'Выполненно: ' + formatDate(dateTimeOfExecution)}</Text>
                )}
                
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
                            onClick={() => handleOpenDeleteDialog(id)}
                            icon={<DeleteIcon />}
                            size="sm">
                        </IconButton>
                    </Flex>
                </Stack>
            </CardBody>
            {/* Окно для удаления задачи*/}
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

            {/* Окно для редактирования задачи */}
            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize={24}>Редактировать задачу</ModalHeader>
                    <ModalBody>
                        <FormControl>
                            <FormLabel fontSize={21}>Заголовок:</FormLabel>
                            <Input
                                fontSize={21}
                                name="title"
                                value={editTaskData.title}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel fontSize={21}>Описание:</FormLabel>
                            <Input
                                as="textarea"           // Превращаем в многострочное поле
                                rows={5}                // Стартовая высота в строках
                                fontSize={21}
                                resize="vertical"       // Разрешить изменение размера
                                paddingTop={3}          // Сдвигаем текст к верхнему краю
                                alignItems="flex-start" // Выравнивание текста сверху (для flex-контейнера)
                                whiteSpace="pre-wrap"   // Сохранять переносы строк
                                name="description"
                                value={editTaskData.description}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel fontSize={21}>Приоритет:</FormLabel>
                            <Select
                                name="priority"
                                value={editTaskData.priority}
                                onChange={handleInputChange}
                                fontSize={21}
                                marginBottom={"7px"}
                            >
                                <option fontSize={21} value={"Низкий"}>Низкий</option>
                                <option fontSize={21} value={"Средний"}>Средний</option>
                                <option fontSize={21} value={"Высокий"}>Высокий</option>
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            {/* <FormLabel fontSize={21}>Категория:</FormLabel>
                            <Input fontSize={21} marginBottom={"7px"} placeholder='Категория' value={editTaskData.category} onChange={handleInputChange} /> */}

                            <FormLabel fontSize={21}>Категория:</FormLabel>
                            <Input
                                fontSize={21}
                                name="category"
                                value={editTaskData.category}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel fontSize={21}>Выполнить до:</FormLabel>
                            <Box marginBottom={"14px"} fontSize={21}>
                                <DatePicker fontSize={21} className='font-semibold' selected={endDate} onChange={handleEndDateDataChange} showTimeSelect dateFormat="dd.MM.yyyy HH:mm" timeFormat='HH:mm' timeCaption='Время'>
                                </DatePicker>
                            </Box>
                        </FormControl>
                        <FormControl mt={4}>
                            
                            <FormLabel fontSize={21}>Выполненно:</FormLabel>
                            <Box marginBottom={"14px"} fontSize={21}>
                                <DatePicker fontSize={21} className='font-semibold' selected={executionDate} onChange={handleExecutionDataChange} showTimeSelect dateFormat="dd.MM.yyyy HH:mm" timeFormat='HH:mm' timeCaption='Время'>
                                </DatePicker>
                            </Box>
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