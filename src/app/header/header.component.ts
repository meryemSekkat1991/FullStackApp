import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription = new Subscription();
  userIsAuthenticated = false;

  constructor(private authServer: AuthService) { }

  ngOnInit(): void {
    this.authListenerSub = this.authServer.getAuthStatusListener().subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSub?.unsubscribe();
  }

  onLogout() {
   this.authServer.logout();
  }
}
