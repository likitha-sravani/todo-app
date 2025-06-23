package com.example.todo.service;

import com.example.todo.model.Task;
import com.example.todo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository repository;

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Page<Task> getTasks(String search, Integer priority, Boolean completed, String sortBy, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy == null ? "id" : sortBy));
        // Simple filtering and searching
        return repository.findAll((root, query, cb) -> {
            var predicates = new java.util.ArrayList<>();
            if (search != null && !search.isEmpty()) {
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + search.toLowerCase() + "%")
                ));
            }
            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }
            if (completed != null) {
                predicates.add(cb.equal(root.get("completed"), completed));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }, pageable);
    }

    public Task addTask(Task task) {
        return repository.save(task);
    }

    public Task updateTask(Long id, Task task) {
        Task t = repository.findById(id).orElseThrow();
        t.setTitle(task.getTitle());
        t.setDescription(task.getDescription());
        t.setDueDate(task.getDueDate());
        t.setPriority(task.getPriority());
        t.setCompleted(task.isCompleted());
        return repository.save(t);
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }
}