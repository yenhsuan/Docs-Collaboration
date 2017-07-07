import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(@Inject('auth') private auth, @Inject('socket') private socket, private router: Router) { }

  ngOnInit() {

    // Init socket service
    if (!this.auth.authenticated()) {
      this.socket.setUserName('');
      this.socket.setUserEmail('');
      this.socket.setUserPic('');
    }
  }

  login(): void {
  this.auth.login()
    .then( (profile: any) => {
      console.log('Auth-callback:');
      console.log(profile);
      const userName = profile.username;
      const userEmail = profile.email;
      const userPic = profile.picture;

      this.socket.setUserName(userName);
      this.socket.setUserEmail(userEmail);
      this.socket.setUserPic(userPic);
    });
  }

  createNewDoc(): void {
    this.socket.setSessionId('zzzzzzzzzzz');
    this.socket.userMode = 'create';
    this.router.navigate(['/main']);
  }

  joinSession(): void {
    this.socket.setSessionId('zzzzzzzzzzz');
    this.socket.userMode = 'join';
    this.router.navigate(['/main']);
  }
}
