package api;

import codes.ResultCode.ResultCodes;
import codes.TaskCodes.TaskCodes;
import com.google.common.collect.ImmutableMap;
import entity.Task;
import model.NewTaskModel;
import org.dozer.Mapper;
import security.AppPrincipal;
import serviсes.TaskService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@RequestScoped
@Path("/tasks")
public class TaskResource {

    @GET
    @Path("/get-all-tasks")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getAllTasks(){

        return taskService.getAllTasks(principal.getUserId());
    }

    @POST
    @Path("/new-task")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Object addNewTask(NewTaskModel newTaskModel) {

        Task task = mapper.map(newTaskModel, Task.class);
        task.setStatus(TaskCodes.TASK);
        task.setUserId(principal.getUserId());
        if (taskService.addNewTask(task) != ResultCodes.SUCCESSFUL) {
            return ImmutableMap.of("resultCode", ResultCodes.INCORRECT_TIME,
                    "resultText", "Некорректно введено время выполнения задания");
        }
        return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL);
    }



    @Inject
    TaskService taskService;

    @Inject
    AppPrincipal principal;

    @Inject
    Mapper mapper;

}
