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

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Todo, TodoRequest } from '../../models/todo.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-todos',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Navbar -->
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-indigo-600">My Todos</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">{{ currentUser?.username }}</span>
              <button (click)="logout()" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Add Todo Form -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            @if (editingTodo) {
              <span>Edit Todo</span>
            } @else {
              <span>Add New Todo</span>
            }
          </h2>
          
          <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                formControlName="title"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter todo title"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                formControlName="description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter todo description"
              ></textarea>
            </div>

            <div class="flex items-center">
              <input
                id="completed"
                type="checkbox"
                formControlName="completed"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="completed" class="ml-2 block text-sm text-gray-700">
                Mark as completed
              </label>
            </div>

            <div class="flex space-x-3">
              <button
                type="submit"
                [disabled]="todoForm.invalid"
                class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
              >
                @if (editingTodo) {
                  <span>Update Todo</span>
                } @else {
                  <span>Add Todo</span>
                }
              </button>
              
              @if (editingTodo) {
                <button
                  type="button"
                  (click)="cancelEdit()"
                  class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              }
            </div>
          </form>
        </div>

        <!-- Todos List -->
        <div class="space-y-4">
          @if (todos.length === 0) {
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
              <p class="text-gray-500 text-lg">No todos yet. Create your first todo above!</p>
            </div>
          }
          
          @for (todo of todos; track todo.id) {
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-xl font-bold text-gray-900" [class.line-through]="todo.completed">
                      {{ todo.title }}
                    </h3>
                    @if (todo.completed) {
                      <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Completed
                      </span>
                    } @else {
                      <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Pending
                      </span>
                    }
                  </div>
                  <p class="mt-2 text-gray-600" [class.line-through]="todo.completed">
                    {{ todo.description }}
                  </p>
                  <p class="mt-2 text-sm text-gray-400">
                    Created: {{ todo.createdAt | date:'short' }}
                  </p>
                </div>
                
                <div class="flex space-x-2 ml-4">
                  <button
                    (click)="editTodo(todo)"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    (click)="deleteTodo(todo.id)"
                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TodosComponent implements OnInit {
    private fb = inject(FormBuilder);
    private todoService = inject(TodoService);
    private authService = inject(AuthService);
    private router = inject(Router);

    todos: Todo[] = [];
    todoForm: FormGroup;
    editingTodo: Todo | null = null;
    currentUser = this.authService.getCurrentUser();

    constructor() {
        this.todoForm = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            completed: [false]
        });
    }

    ngOnInit(): void {
        this.loadTodos();
    }

    loadTodos(): void {
        this.todoService.getAllTodos().subscribe({
            next: (todos) => {
                this.todos = todos;
            },
            error: (error) => {
                console.error('Error loading todos:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.todoForm.valid) {
            const todoRequest: TodoRequest = this.todoForm.value;

            if (this.editingTodo) {
                this.todoService.updateTodo(this.editingTodo.id, todoRequest).subscribe({
                    next: () => {
                        this.loadTodos();
                        this.resetForm();
                    },
                    error: (error) => {
                        console.error('Error updating todo:', error);
                    }
                });
            } else {
                this.todoService.createTodo(todoRequest).subscribe({
                    next: () => {
                        this.loadTodos();
                        this.resetForm();
                    },
                    error: (error) => {
                        console.error('Error creating todo:', error);
                    }
                });
            }
        }
    }

    editTodo(todo: Todo): void {
        this.editingTodo = todo;
        this.todoForm.patchValue({
            title: todo.title,
            description: todo.description,
            completed: todo.completed
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    deleteTodo(id: number): void {
        if (confirm('Are you sure you want to delete this todo?')) {
            this.todoService.deleteTodo(id).subscribe({
                next: () => {
                    this.loadTodos();
                },
                error: (error) => {
                    console.error('Error deleting todo:', error);
                }
            });
        }
    }

    cancelEdit(): void {
        this.resetForm();
    }

    resetForm(): void {
        this.editingTodo = null;
        this.todoForm.reset({
            title: '',
            description: '',
            completed: false
        });
    }

    logout(): void {
        this.authService.logout();
    }
}
