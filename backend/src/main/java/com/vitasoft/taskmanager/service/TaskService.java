package com.vitasoft.taskmanager.service;

import com.vitasoft.taskmanager.dto.TaskDto;

import java.util.List;

public interface TaskService {
    TaskDto createTask(TaskDto taskDto, String username);
    List<TaskDto> getAllTasks(String username);
    TaskDto getTaskById(Long taskId, String username);
    TaskDto updateTask(Long taskId, TaskDto taskDto, String username);
    void deleteTask(Long taskId, String username);
}
