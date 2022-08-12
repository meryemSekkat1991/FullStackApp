import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
 loading = false;
 private authSub: Subscription = new Subscription();

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.authService.getAuthStatusListener().subscribe(autStatus => {
      if(!autStatus) {
        this.loading = false;
      }
    });
  }

  onSignup(form: NgForm) {
    if(form.invalid) {
      return
    }
    this.loading = true;
    this.authService.createUser(form.value.email, form.value.password)
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
