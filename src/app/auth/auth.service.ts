import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token!: string;
  private tokenTimer!: any;
  private userId!: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(environment.API_BASE_URL+"/api/user/signup", authData).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.authStatusListener.next(false);
      },
    );
  }

  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  //Login
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        environment.API_BASE_URL+"/api/user/login",
        authData,
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expireTime = response.expiresIn * 1000;
            this.setAuthTimer(expireTime);
            this.isAuthenticated = true;
            this.userId = response.userId;
            const now = new Date();
            const expireDate = new Date(now.getTime() + expireTime);
            console.log(expireDate);
            this.saveAuthData(token, expireDate, this.userId);
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        },
      );
  }

  //Check timer
  autoAuthUser() {
    const authInfo = this.getAuthData();
    const now = new Date();
    const expiresIn = authInfo.expireDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }

  //Logout
  logout() {
    this.clearAuthData();
    this.token = 'undefined';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    this.userId = 'null';
    clearTimeout(this.tokenTimer);
  }

  //Reset timer
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  //Save token
  private saveAuthData(token: string, expireDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expireDate', expireDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  //Delete token
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expireDate');
    localStorage.removeItem('userId');
  }

  //load token
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expireDate = localStorage.getItem('expireDate');
    const userId = localStorage.getItem('userId') as string;
    if (!token || !expireDate) {
      return {
        token: '',
        expireDate: new Date(-4),
        userId: '',
      };
    }
    return {
      token: token,
      expireDate: new Date(expireDate),
      userId: userId,
    };
  }
}
