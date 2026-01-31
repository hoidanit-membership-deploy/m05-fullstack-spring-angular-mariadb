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
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
            <p class="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          @if (errorMessage) {
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p class="text-red-700">{{ errorMessage }}</p>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your username"
              />
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <p class="mt-1 text-sm text-red-600">Username is required</p>
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
                placeholder="Enter your password"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-600">Password is required</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            >
              @if (isLoading) {
                <span>Signing in...</span>
              } @else {
                <span>Sign In</span>
              }
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Don't have an account?
              <a routerLink="/register" class="text-indigo-600 hover:text-indigo-800 font-medium ml-1">
                Register here
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
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup;
    errorMessage = '';
    isLoading = false;

    constructor() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/todos']);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = error.error?.message || 'Login failed. Please try again.';
                }
            });
        }
    }
}
