package com.example.todo.service;

import com.example.todo.model.Task;
import com.example.todo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository repository;

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Task addTask(Task task) {
        return repository.save(task);
    }

    public Task updateTask(Long id, Task task) {
        Task t = repository.findById(id).orElseThrow();
        t.setTitle(task.getTitle());
        t.setCompleted(task.isCompleted());
        return repository.save(t);
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }
}