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

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900">Create Account</h2>
            <p class="mt-2 text-gray-600">Join us today</p>
          </div>

          @if (errorMessage) {
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p class="text-red-700">{{ errorMessage }}</p>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Choose a username"
              />
              @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
                <p class="mt-1 text-sm text-red-600">Username must be at least 3 characters</p>
              }
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your email"
              />
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-600">Please enter a valid email</p>
              }
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Create a password"
              />
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-600">Password must be at least 6 characters</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            >
              @if (isLoading) {
                <span>Creating account...</span>
              } @else {
                <span>Create Account</span>
              }
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Already have an account?
              <a routerLink="/login" class="text-indigo-600 hover:text-indigo-800 font-medium ml-1">
                Sign in here
              </a>
            </p>
            <a routerLink="/" class="block mt-4 text-gray-500 hover:text-gray-700">
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup;
    errorMessage = '';
    isLoading = false;

    constructor() {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/todos']);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
                }
            });
        }
    }
}
