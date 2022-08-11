import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";

@Injectable({providedIn: 'root'})

export class AuthService {
  private token= "";

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(res => {
        console.log(res)
      } )
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    this.http.post('http://localhost:3000/api/user/login', authData)
      .subscribe( res => {
        console.log((res: { token: any; }) => {
          const token = res.token;
          this.token = token;
        })
      })
  }
}
