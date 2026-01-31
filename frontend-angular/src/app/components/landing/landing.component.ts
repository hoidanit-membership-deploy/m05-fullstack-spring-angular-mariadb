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
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing',
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Navbar -->
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-indigo-600">TodoApp</h1>
            </div>
            <div class="flex items-center space-x-4">
              @if (currentUser) {
                <span class="text-gray-700">Welcome, {{ currentUser.username }}</span>
                <a routerLink="/todos" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  My Todos
                </a>
                <button (click)="logout()" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                  Logout
                </button>
              } @else {
                <a routerLink="/login" class="text-indigo-600 hover:text-indigo-800 font-medium transition">
                  Login
                </a>
                <a routerLink="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Register
                </a>
              }
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h2 class="text-5xl font-extrabold text-gray-900 mb-6">
            Manage Your Tasks <span class="text-indigo-600">Efficiently</span>
          </h2>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A simple and elegant todo application built with Spring Boot and Angular.
            Keep track of your tasks and boost your productivity.
          </p>
          <div class="flex justify-center space-x-4">
            @if (!currentUser) {
              <a routerLink="/register" class="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg">
                Get Started
              </a>
              <a routerLink="/login" class="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-indigo-600">
                Sign In
              </a>
            } @else {
              <a routerLink="/todos" class="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg">
                Go to Todos
              </a>
            }
          </div>
        </div>

        <!-- Features -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="text-indigo-600 text-4xl mb-4">✓</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Easy to Use</h3>
            <p class="text-gray-600">Simple and intuitive interface for managing your daily tasks</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="text-indigo-600 text-4xl mb-4">🔒</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Secure</h3>
            <p class="text-gray-600">Your data is protected with JWT authentication</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="text-indigo-600 text-4xl mb-4">⚡</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Fast</h3>
            <p class="text-gray-600">Built with modern technologies for optimal performance</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-slate-800 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="text-center">
            <p class="text-gray-300 font-medium">TodoApp - Built with Spring Boot & Angular</p>
            <p class="mt-1 text-sm text-gray-500">Hỏi Dân IT - Deploy Siêu Tốc</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    currentUser = this.authService.getCurrentUser();

    constructor() {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    logout(): void {
        this.authService.logout();
    }
}
