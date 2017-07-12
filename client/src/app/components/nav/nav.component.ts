import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(@Inject('auth') private auth, private router: Router) { }

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
