package com.vitasoft.taskmanager.service.impl;

import com.vitasoft.taskmanager.dto.TaskDto;
import com.vitasoft.taskmanager.model.Task;
import com.vitasoft.taskmanager.model.User;
import com.vitasoft.taskmanager.repository.TaskRepository;
import com.vitasoft.taskmanager.repository.UserRepository;
import com.vitasoft.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    public TaskDto createTask(TaskDto taskDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = Task.builder()
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .completed(taskDto.isCompleted())
                .reminderTime(taskDto.getReminderTime())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    @Override
    public List<TaskDto> getAllTasks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository.findByUser(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto getTaskById(Long taskId, String username) {
        Task task = getTaskAndVerifyOwner(taskId, username);
        return mapToDto(task);
    }

    @Override
    public TaskDto updateTask(Long taskId, TaskDto taskDto, String username) {
        Task task = getTaskAndVerifyOwner(taskId, username);

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setCompleted(taskDto.isCompleted());
        task.setReminderTime(taskDto.getReminderTime());

        Task updatedTask = taskRepository.save(task);
        return mapToDto(updatedTask);
    }

    @Override
    public void deleteTask(Long taskId, String username) {
        Task task = getTaskAndVerifyOwner(taskId, username);
        taskRepository.delete(task);
    }

    private Task getTaskAndVerifyOwner(Long taskId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied. You do not own this task.");
        }

        return task;
    }

    private TaskDto mapToDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .completed(task.isCompleted())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .reminderTime(task.getReminderTime())
                .build();
    }
}
