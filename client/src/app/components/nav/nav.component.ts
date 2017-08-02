import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  private tab: string;

  constructor(@Inject('auth') private auth, private router: Router, private location: Location) {
  }

  ngOnInit() {
  }


  authenticated(): boolean {
    return this.auth.authenticated();
  }

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
    // this.router.navigate(['/start']);
  }

  getUsername(): string {
    if (this.auth.getProfile()) {
      return this.auth.getProfile().username;
    }
    return ' ';
  }

  getUsermail(): string {
    if (this.auth.getProfile()) {
      return this.auth.getProfile().email;
    }
    return ' ';
  }
}
