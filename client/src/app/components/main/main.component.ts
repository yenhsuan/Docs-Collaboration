import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(@Inject('auth') private auth, @Inject('socket') private socket, private router: Router) { }

  ngOnInit() {

    if (this.socket.userMode === '') {
      this.router.navigate(['/start']);
    } else {

      this.socket.socketInit();
      if ( this.socket.userMode === 'create') {
        this.socket.socketCreateDoc();
      } else {
        this.socket.socketJoinSession();
      }

    }
  }
}
