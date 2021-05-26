package persistence;

import entity.Task;

import java.util.List;

public class TaskDAO extends BaseDAO<Task>{


    public List<Task> getAllTasks(int id){

        return entities.createNamedQuery("Task.getAllTasks", Task.class)
                .setParameter("id", id)
                .getResultList();
    }
}
