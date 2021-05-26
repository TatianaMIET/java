package serviсes;

import codes.ResultCode.ResultCodes;
import entity.Task;
import persistence.TaskDAO;

import javax.inject.Inject;
import java.util.List;

public class TaskService {

    public List<Task> getAllTasks(int id){

        return taskDAO.getAllTasks(id);

    }

    public int addNewTask(Task task){

      if (task.getTimeFrom().isAfter(task.getTimeTo()) || task.getTimeFrom().isEqual(task.getTimeTo()) ){
          return ResultCodes.INCORRECT_TIME;
      }
      else{
          taskDAO.add(task);
          return ResultCodes.SUCCESSFUL;
      }
    }


    @Inject
    TaskDAO taskDAO;
}
