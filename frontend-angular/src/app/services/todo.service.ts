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

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoRequest } from '../models/todo.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/todos`;

    getAllTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>(this.apiUrl);
    }

    getTodoById(id: number): Observable<Todo> {
        return this.http.get<Todo>(`${this.apiUrl}/${id}`);
    }

    createTodo(request: TodoRequest): Observable<Todo> {
        return this.http.post<Todo>(this.apiUrl, request);
    }

    updateTodo(id: number, request: TodoRequest): Observable<Todo> {
        return this.http.put<Todo>(`${this.apiUrl}/${id}`, request);
    }

    deleteTodo(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
