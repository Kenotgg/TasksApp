// Импорт различных библиотек для работы
import { useToast, Card, Select, AlertDialog, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, FormControl, FormLabel, Input, ModalFooter, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, CardFooter, Spacer, Stack, CardHeader, Divider, CardBody, Text, AbsoluteCenter, Box, Checkbox, textDecoration, IconButton, Flex, border } from '@chakra-ui/react';
import { format, isValid, parseISO } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';
import { DeleteIcon, EditIcon, BellIcon, CalendarIcon } from '@chakra-ui/icons';
import React, { useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReminderSelect from './ReminderSelect';
// Русификация дат и календаря
import ru from 'date-fns/locale/ru';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

export default function Task({ title, description, priority, dueDate, dateTimeOfExecution, isCompleted: initialIsCompleted, updateTasksList, category, id }) {
    // Переменные для хранения состояний
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(null);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null); // Состояние для хранения ID удаляемой задачи
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const toast = useToast();
    const cancelRef = React.useRef();
    // Состояния для ошибок
    const [endDateError, setEndDateError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    // Состояния для хранения даты при редактировании
    const [executionDate, setexecutionDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reminders, setReminders] = useState([]);
     // Структура данных для уведомления
    const reminder = {
        id: Date.now(), // Уникальный ID (можно использовать что-то более надежное)
        dateTime: '2024-07-29T12:00', // Дата и время (ISO 8601)
        text: 'Позвонить маме', // Текст напоминания
        isCompleted: false, // Флаг, указывающий, выполнено ли напоминание
    };
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

      useEffect(() => {
        // Запрашиваем разрешение при монтировании компонента
        if (!("Notification" in window)) {
            console.log("Этот браузер не поддерживает уведомления.");
            return;
        }
        Notification.requestPermission().then(permission => {
            setNotificationPermission(permission);
        });
    }, []);
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


    // Функции для открытия закрытия модального окна установки напоминаний
    const handleOpenNotificationModal = () => {
        setIsNotificationModalOpen(true);

    };

    const handleCloseNotificationModal = () => {
        setIsNotificationModalOpen(false);
    };

    
    const handleSaveNotificationInModal = () => {
        setIsNotificationModalOpen(false);
         
        // Получаем дату из формы
        const taskDueDate = new Date(editTaskData.dueDate);
         const now = new Date(); // Определяем текущее время здесь
         const tenSecondsBeforeNow = new Date(now.getTime() - 10000); // 10 секунд в миллисекундах
        // Для каждого выбранного времени напоминания
        selectedReminders.forEach(reminderValue => {
            // Вычитаем минуты
            const reminderTime = subtractMinutes(taskDueDate, reminderValue);

            if (reminderTime >= tenSecondsBeforeNow) {
                showNotification(
                    "Напоминание о задаче!",
                    `Задача "${editTaskData.title}" должна быть выполнена.`
                );
            }
        //     if (reminderTime < now) {
        // showNotification(
        //   "Напоминание о задаче!",
        //   `Задача "${editTaskData.title}" должна быть выполнена.`
        // );
        // }else{
        //     console.log("Уведмление еще не должно отработать");
        // }
            // Создаем объект напоминания
            const newReminder = {
                id: Date.now(),
                dateTime: reminderTime.toISOString(),
                text: `Напоминание о задаче "${editTaskData.title}"`,
                isCompleted: false,
            };

            // Добавляем напоминание
            addReminder(newReminder);
        });
    };

        //Добавить напоминание в список
        // const addReminder = (dateTime, text) => {
        //     const newReminder = {
        //         id: Date.now(),
        //         dateTime: dateTime,
        //         text: text,
        //         isCompleted: false,
        //     };
        //     toast({title: "reminder"});
        //     console.log(reminders);
        //     setReminders([...reminders, newReminder]);
        //     console.log(reminders);
        // };
    //Измененная функция добавления напоминания
    const addReminder = (reminder) => {
        setReminders([...reminders, reminder]);
        toast({ title: "Напоминание добавлено!" }); //Добавлено
    };
    const showNotification = useCallback((title, body) => {
        if (notificationPermission === "granted") {
            const notification = new Notification(title, {
                body: body,
                icon: "/logo192.png",
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } else if (notificationPermission === "denied") {
            alert("Вы запретили показ уведомлений. Разрешите их в настройках браузера.");
        }
    }, [notificationPermission]);

    const [scheduledNotifications, setScheduledNotifications] = useState([]);

    useEffect(() => {
        if (scheduledNotifications.length === 0) return; 

        scheduledNotifications.forEach(notification => {
            const timeDiff = new Date(notification.time).getTime() - new Date().getTime();

            if (timeDiff <= 0) {
                // Время пришло, показываем уведомление
                showNotification(notification.title, notification.body);

                // Удаляем уведомление из массива
                setScheduledNotifications(prevNotifications =>
                    prevNotifications.filter(n => n.id !== notification.id)
                );
            } else {
                // Планируем показ уведомления
                setTimeout(() => {
                    showNotification(notification.title, notification.body);
                    // Удаляем уведомление из массива после показа
                    setScheduledNotifications(prevNotifications =>
                        prevNotifications.filter(n => n.id !== notification.id)
                    );
                }, timeDiff);
            }
        });
    }, [scheduledNotifications, showNotification]);

    const handleInputChange = (e) => {
        setEditTaskData({
            ...editTaskData,
            [e.target.name]: e.target.value,
        });
    };
    // Функция отправляющая запрос на изменение задачи на сервер с входными параметрами
    const handleEndEditTask = async (event) => {
        event.preventDefault();
        console.log(id + "Task ID");
        if (editTaskData.title === null || editTaskData.title === undefined || editTaskData.title.trim() === "") {
            toast({ title: 'Нельзя ввести пустой заголовок.' });
            return;
        }

        if (!isValid(endDate)) {
            toast({ title: 'Конечный срок имел некорректный формат', isClosable: 'true' });
            return;
        }
        else if (!isValid(executionDate)) {
            toast({ title: 'Дата выполнения имела некорректный формат', isClosable: 'true' });
            return;
        }

        const dueDateToAdd = endDate.toISOString();
        const executionDateToAdd = executionDate.toISOString();

        const dataToSend = {
            title: editTaskData.title || "", // Если title null или undefined, ставим ""
            description: editTaskData.description || "", // Если description null или undefined, ставим ""
            dueDate: dueDateToAdd, // Если dueDateToAdd null или undefined, ставим null
            priority: editTaskData.priority || "", // Если priority null или undefined, ставим ""
            category: editTaskData.category || "", // Если category null или undefined, ставим ""
            isCompleted: editTaskData.isCompleted || false, // Если isCompleted null или undefined, ставим false
            dateTimeOfExecution: executionDateToAdd || null, // Если dateTimeOfExecutionToAdd null или undefined, ставим null
        };
        try {
            console.log("Перед отправкой");
            console.log("Заголовки:", { 'Content-Type': 'application/json' });
            console.log("Тело запроса:", JSON.stringify(dataToSend));

            const response = await fetch(`https://localhost:7148/api/Tasks/editTask?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' // Указываем тип контента
                },
                body: JSON.stringify(dataToSend)
            });
            console.log("url " + response.url);


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


    const [selectedReminders, setSelectedReminders] = useState([]);

    const handleReminderChange = (values) => {
        console.log(selectedReminders);
        setSelectedReminders(values);
        console.log('Выбраны значения:', values);
    };


    const handleDateChange = (date) => {
        setStartDate(date);
    };

    const handleCalendarOpen = () => {
        setIsCalendarOpen(true);
    };

    const handleCalendarClose = () => {
        setIsCalendarOpen(false);
    };

    const subtractMinutes = (date, minutesToSubtract) => {
        const newDate = new Date(date);
        newDate.setMinutes(newDate.getMinutes() - minutesToSubtract);
        return newDate;
    };
    //  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
     //Спрашиваем разрешение на показ уведомления
  
   
    //  const handleAddReminder = () => {
    //     addReminder(newReminderDateTime, newReminderText);
    //     setNewReminderDateTime('');
    //     setNewReminderText('');
    // };

    //  //Показать уведомление
    // const showNotification = (title, body) => {
    //     console.log("Должен отправить уведомление");
    //     if (notificationPermission === "granted") {
    //         // const notification = new Notification("Porkchop is calling!!!", {
    //         //     body: "Это тестовое уведомление из твоего React-приложения!",
    //         //     icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDmeVh6ykOmAsC5M-MVRKtCnEJq3UUXQPEcg&s", // Замени на путь к своей иконке (необязательно)
    //         // });
    //          const notification = new Notification(title, {
    //             body: body,
    //             icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDmeVh6ykOmAsC5M-MVRKtCnEJq3UUXQPEcg&s", // Замени на путь к своей иконке (необязательно)
    //         });

    //         notification.onclick = () => {
    //             window.focus();
    //             notification.close();
    //         };
    //     } else if (notificationPermission === "denied") {
    //         alert("Вы запретили показ уведомлений. Разрешите их в настройках браузера.");
    //     } else {
    //         console.log("Ожидание разрешения на показ уведомлений...");
    //     }
    // };

     //Планирование уведомлений
        useEffect(() => {
            reminders.forEach(reminder => {
                if (!reminder.isCompleted) {
                    const timeDiff = new Date(reminder.dateTime).getTime() - new Date().getTime();
    
                    if (timeDiff > 0) {
                        setTimeout(() => {
                            showNotification(reminder.dateTime, reminder.text);
                            // Помечаем напоминание как выполненное
                            setReminders(prevReminders =>
                                prevReminders.map(r =>
                                    r.id === reminder.id ? { ...r, isCompleted: true } : r
                                )
                            );
                        }, timeDiff);
                    } else {
                        // Если время уже прошло, помечаем напоминание как выполненное
                        setReminders(prevReminders =>
                            prevReminders.map(r =>
                                r.id === reminder.id ? { ...r, isCompleted: true } : r
                            )
                        );
                    }
                }
            });
        }, [reminders, showNotification]); // Важно: добавь showNotification в зависимости
    return (
        // Карточка со всей информацией о заметке
        <Card style={cardStyle} marginTop={5}>
            <CardHeader>
                <Stack direction={"row"}>
                    <Text fontWeight={"bold"} fontSize={24} >{title + ':'}</Text>
                    <Spacer></Spacer>
                    <IconButton marginRight={1} aria-label="Установить напоминание"
                        onClick={handleOpenNotificationModal}
                        icon={<BellIcon />}
                        size="sm">
                    </IconButton>
                </Stack>

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
                        <input type='checkbox' style={{ width: '25px', height: '25px' }} checked={isCompleted} onChange={handleCheckBoxChange}></input>
                        {/* <Checkbox size={'lg'}  isChecked={isCompleted} onChange={handleCheckBoxChange}></Checkbox> */}
                        <Spacer />
                        <IconButton marginRight={1} aria-label="Редактировать задачу"
                            onClick={handleOpenEditModal}
                            icon={<EditIcon />}
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
                    <ModalHeader fontSize={24}>
                        <Stack direction={'row'}>
                            <Text>Редактировать задачу:</Text>
                            <Spacer></Spacer>
                            <IconButton aria-label="Удалить задачу"
                                onClick={() => handleOpenDeleteDialog(id)}
                                icon={<DeleteIcon />}
                                size="sm">
                            </IconButton>
                        </Stack>
                    </ModalHeader>
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
                                rows={5}
                                height={125}           // Стартовая высота в строках
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
                            <Box border={"2px solid black"} borderColor={'gray.200'} borderRadius={"md"} marginBottom={"14px"} fontSize={21}>
                                <DatePicker fontSize={21} className='font-semibold' selected={endDate} onChange={handleEndDateDataChange} showTimeSelect dateFormat="dd.MM.yyyy HH:mm" timeFormat='HH:mm' timeCaption='Время'>
                                </DatePicker>
                            </Box>
                        </FormControl>
                        <FormControl mt={4}>

                            <FormLabel fontSize={21}>Выполненно:</FormLabel>
                            <Box border={"2px solid black"} borderColor={'gray.200'} borderRadius={"md"} marginBottom={"14px"} fontSize={21}>
                                <DatePicker fontSize={21} className='font-semibold' selected={executionDate} onChange={handleExecutionDataChange} showTimeSelect dateFormat="dd.MM.yyyy HH:mm" timeFormat='HH:mm' timeCaption='Время'>
                                </DatePicker>
                            </Box>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleEndEditTask}>
                            Сохранить
                        </Button>
                        <Button onClick={handleCloseEditModal}>Отмена</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Окно для установки напоминания */}
            <Modal isOpen={isNotificationModalOpen} onClose={handleCloseNotificationModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize={24}>
                        <Text>Установить напоминание:</Text>
                    </ModalHeader>
                    <ModalBody>
                        <FormLabel>
                            <Text fontSize={21}>Заголовок:</Text>
                            <Text fontWeight={'normal'} fontSize={21}>{editTaskData.title}</Text>
                            <Text fontSize={21}>Описание:</Text>
                            <Text fontWeight={'normal'} fontSize={21}>{editTaskData.description}</Text>
                            <Text fontSize={21}>Время срабатывания:</Text>
                            <Text fontWeight={'normal'} fontSize={21}>{formatDate(editTaskData.dueDate)}</Text>
                            <Text fontSize={21}>Напомнить:</Text>
                            <ReminderSelect onChange={handleReminderChange} value={selectedReminders}></ReminderSelect>
                        </FormLabel>
                        <div>
            {/* Тестовая часть формы */}
            {/* <h2>Добавить напоминание</h2>
            <input
                type="datetime-local"
                value={newReminderDateTime}
                onChange={(e) => setNewReminderDateTime(e.target.value)}
            />
            <input
                type="text"
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
            />
            <Button onClick={handleAddReminder}>Добавить</Button> */}
             {/*Отображаем напоминания*/}
            <div>
                <Text>Все напоминания</Text>
              {reminders.map((reminder) => (
                <div key={reminder.id}>
                  <Text>Дата: {formatDate(reminder.dateTime)}</Text>
                  <Text>Текст: {reminder.text}</Text>
                </div>
              ))}
            </div>
             {/* Тестовая часть формы */}
            </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSaveNotificationInModal}>
                            Сохранить
                        </Button>
                        <Button onClick={handleCloseNotificationModal}>Отмена</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>

    )
};