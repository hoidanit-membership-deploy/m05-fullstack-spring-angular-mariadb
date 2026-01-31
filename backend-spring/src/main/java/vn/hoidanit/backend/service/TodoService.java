/*
 * Author: Hỏi Dân IT - @hoidanit
 *
 * This source code is developed for the course
 * "Deploy Siêu Tốc".
 * It is intended for educational purposes only.
 * Unauthorized distribution, reproduction, or modification is strictly prohibited.
 *
 * Copyright (c) 2026 Hỏi Dân IT. All Rights Reserved.
 */

package vn.hoidanit.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.hoidanit.backend.dto.request.TodoRequest;
import vn.hoidanit.backend.dto.response.TodoResponse;
import vn.hoidanit.backend.entity.Todo;
import vn.hoidanit.backend.entity.User;
import vn.hoidanit.backend.repository.TodoRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public List<TodoResponse> getAllTodos() {
        User user = getCurrentUser();
        return todoRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TodoResponse getTodoById(Long id) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        return convertToResponse(todo);
    }

    public TodoResponse createTodo(TodoRequest request) {
        User user = getCurrentUser();

        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.getCompleted() != null ? request.getCompleted() : false);
        todo.setUser(user);

        Todo savedTodo = todoRepository.save(todo);
        return convertToResponse(savedTodo);
    }

    public TodoResponse updateTodo(Long id, TodoRequest request) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }

        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }

    @Transactional
    public void deleteTodo(Long id) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        todoRepository.delete(todo);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userDetailsService.getUserByUsername(username);
    }

    private TodoResponse convertToResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt());
    }
}
