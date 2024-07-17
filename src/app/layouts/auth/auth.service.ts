import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  defaultUsers = [
    {
      name: 'Admin',
      email: 'toms@123',
      password: '1234',
      role: 'ADMIN'
    },
    {
      name: 'User',
      email: 'user@123',
      password: '1234',
      role: 'USER'
    }
  ]
  constructor() { }

  registerUsers(user: any) {
    let users = [];
    user.role = 'USER';
    if (localStorage.getItem('Users')) {
      users = JSON.parse(localStorage.getItem('Users') || '[]');
      // insert users if not exists
      if (users.find((x: { email: string; }) => x.email === user.email)) {
        return false;
      }
      users.push(user);
    } else {
      users.push(user);
    }
    localStorage.setItem('Users', JSON.stringify(users));
  }

  loginUsers(email: string, password: string) {
    let users = [];
    if (localStorage.getItem('Users')) {
      users = JSON.parse(localStorage.getItem('Users') || '[]');
    }
    users = [...users, ...this.defaultUsers];
    let user = users.find((x: { email: string; password: string; }) => x.email === email && x.password === password);
    if (user) {
      return user;
    } else {
      return false;
    }
  }

  setAccessToken(user: string) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    let randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('accessToken', randomToken);
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  checkRole(role: string) {
    return this.currentUser && this.currentUser?.role === role;
  }

  get accessToken() {
    return localStorage.getItem('accessToken');
  }
}
