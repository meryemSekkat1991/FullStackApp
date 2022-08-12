import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string | undefined = "";
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer | undefined;
  private userId: string = "";

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
     return this.http
      .post("http://localhost:3000/api/user/signup", authData).subscribe(() => {
        this.router.navigate(['/']);
       }, error => {
        this.authStatusListener.next(false)
       })
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if(!authInfo) {
      return
    }
    const now = new Date();
    // @ts-ignore
    const expiresIn = authInfo?.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInfo?.token;
      this.isAuthenticated = true;
      // @ts-ignore
      this.userId = authInfo.userId;
      console.log(authInfo, expiresIn)
      this.stAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true);
    }
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          console.log(expiresInDuration);
          this.stAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate)
          this.saveAuthData(token, expirationDate, this.userId)
          this.router.navigate(['/']);
        }
      }, error =>  {
        this.authStatusListener.next(false)
      });
  }

  logout() {
    this.token = "";
    this.isAuthenticated = false;
    this.authStatusListener.next(false);

    //expire time cleaning
    clearTimeout(this.tokenTimer);

    //reset user id
    this.userId = '';
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, experationDate: Date, userId: string){
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', experationDate.toISOString())
    localStorage.setItem('userid', userId)
  }


  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private stAuthTimer(duration: number) {
    console.log("sting timer" + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000 );
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId')
    if(!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId

    }
  }
}
