package com.vitasoft.taskmanager.controller;

import com.vitasoft.taskmanager.dto.TaskDto;
import com.vitasoft.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Handles all the task-related endpoints (creating, updating, fetching, etc).
 * Everything here requires a valid JWT token.
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * Create a new task tied to the logged-in user.
     * 
     * @param taskDto        the task details from the request body
     * @param authentication to grab the username of who is making the request
     * @return the saved task DTO
     */
    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto, Authentication authentication) {
        String username = authentication.getName();
        TaskDto createdTask = taskService.createTask(taskDto, username);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks(Authentication authentication) {
        String username = authentication.getName();
        List<TaskDto> tasks = taskService.getAllTasks(username);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable(name = "id") Long id, Authentication authentication) {
        String username = authentication.getName();
        TaskDto task = taskService.getTaskById(id, username);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable(name = "id") Long id,
            @RequestBody TaskDto taskDto,
            Authentication authentication) {
        String username = authentication.getName();
        TaskDto updatedTask = taskService.updateTask(id, taskDto, username);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable(name = "id") Long id, Authentication authentication) {
        String username = authentication.getName();
        taskService.deleteTask(id, username);
        return ResponseEntity.ok("Task deleted successfully.");
    }
}
