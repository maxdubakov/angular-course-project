import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, Subject, throwError} from "rxjs";

import {User} from "./user.model";
import {Router} from "@angular/router";

export interface AuthResponseData {
  kind: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  tokenExpTimer: any;

  private API_KEY = 'XYZ'; // dummy API_KEY
  private signup_url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  private login_url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
  private static USER_DATA = 'userData';

  constructor(private http: HttpClient,
              private router: Router) {
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        this.signup_url,
        {
          email: email,
          password: password,
          returnSecureToken: true
        })
      .pipe(
        catchError(AuthService.handleError),
        tap(resData => {
          this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpDate: string
    } = JSON.parse(localStorage.getItem(AuthService.USER_DATA));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expDuration = new Date(userData._tokenExpDate).getTime() - new Date().getTime();
      this.autoLogout(expDuration);
    }
  }

  autoLogout(expDuration: number) {
    console.log(expDuration);
    this.tokenExpTimer = setTimeout(() => {
      this.logout();
    }, expDuration);
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        this.login_url,
        {
          email: email,
          password: password,
          returnSecureToken: true
        })
      .pipe(
        catchError(AuthService.handleError),
        tap(resData => {
          this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }))
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem(AuthService.USER_DATA);
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }

    this.tokenExpTimer = null;
  }

  private static handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist!'
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct!';
        break;
    }

    return throwError(errorMessage);
  }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem(AuthService.USER_DATA, JSON.stringify(user));
  }
}
