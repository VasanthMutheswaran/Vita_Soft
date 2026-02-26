package com.vitasoft.taskmanager.repository;

import com.vitasoft.taskmanager.model.Task;
import com.vitasoft.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
}
