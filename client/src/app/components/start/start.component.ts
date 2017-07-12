import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import sha512 from 'js-sha512';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  sessionCode = '';
  constructor(@Inject('auth') private auth, @Inject('socket') private socket, private router: Router) { }


  ngOnInit() {
    // Init socket service
    if (!this.auth.authenticated()) {
      this.socket.setUserName('');
      this.socket.setUserEmail('');
      this.socket.setUserPic('');
    }

    if ( this.auth.authenticated()) {
      this.auth.reloadProfile();
    }
  }




  login(): void {
    this.auth.login();
      // .then( (profile: any) => {
      //   console.log('Auth-callback:');
      //   console.log(profile);
      //   const userName = profile.username;
      //   const userEmail = profile.email;
      //   const userPic = profile.picture;

      //   this.socket.setUserName(userName);
      //   this.socket.setUserEmail(userEmail);
      //   this.socket.setUserPic(userPic);
      //   this.profileRead = true;
      //   this.loading = false;
        // this.router.navigate(['/']);
      // });
  }



  createNewDoc(): void {

    const session = sha512( this.auth.getProfile().username + Math.random().toString(36).substr(2, 5) );
    console.log(session);


    this.socket.setSessionId(session);
    this.socket.userMode = 'create';
    this.router.navigate(['/main']);
  }

  joinSession(): void {
    this.socket.setSessionId(this.sessionCode);
    this.socket.userMode = 'join';
    this.router.navigate(['/main']);
  }
}
