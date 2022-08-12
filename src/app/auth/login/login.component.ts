import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authSub: Subscription = new Subscription();
  loading = false;


  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.authService.getAuthStatusListener().subscribe( authStatus => {
      this.loading = false
    })
  }

  onLogin(form: NgForm) {
   if(form.invalid) {
     return
   }
   this.loading = true;
   this.authService.login(form.value.email, form.value.password)
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
