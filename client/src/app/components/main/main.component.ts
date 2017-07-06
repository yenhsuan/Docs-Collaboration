import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(@Inject('auth') private auth, @Inject('socket') private socket) { }

  ngOnInit() {
  }

  login(): void {
    this.auth.login()
      .then( (profile: any) => {
        console.log('Auth-callback:');
        console.log(profile);
        const userName = profile.username;
        const userEmail = profile.email;
        const userPic = profile.picture;
        this.socket.socketInit(userName, userEmail, userPic);
      });
  }

  createNewDoc(): void {
    this.socket.socketCreateDoc('zzzzzzzzzzz');
  }

  joinSession(): void {
    this.socket.socketJoinSession('zzzzzzzzzzz');
  }

}
