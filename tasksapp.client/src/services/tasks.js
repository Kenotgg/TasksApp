// Сервис для получения данных с сервера(бекенда) - с базы данных.
import axios from "axios"

export const fetchTasks = async () => {
    try{
        var response = await axios.get("http://localhost:5273/api/tasks/getTasks");
        return response.data;
    }
    catch(e){
console.error(e);
    }
}