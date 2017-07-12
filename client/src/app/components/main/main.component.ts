import { Component, OnInit, Inject, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription} from 'rxjs/Subscription';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  checkSessionValid: Subscription;
  constructor(@Inject('auth') private auth, @Inject('socket') private socket, private router: Router) { 
  }

  ngOnInit() {
    const body: any = document.getElementsByTagName('body')[0];
    console.log(body.style.background);
    body.style.background = 'white';

    if (this.socket.userMode === '') {
      this.router.navigate(['/start']);
    } else {


      this.socket.socketInit();
      if ( this.socket.userMode === 'create') {
        this.socket.socketCreateDoc();
      } else {
        this.socket.socketJoinSession();
      }

      this.checkSessionValid = this.socket.subscribeSessionLegal()
        .subscribe( (nxtState: boolean) => {
          if (nxtState === false) {
            this.router.navigate(['/start']);
          }
        });

    }
  }

  ngOnDestroy() {
    const body: any = document.getElementsByTagName('body')[0];
    console.log(body.style.background);
    body.style.background = '#274666';

  }
}
