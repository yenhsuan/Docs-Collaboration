import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(@Inject('auth') private auth) { }

  ngOnInit() {

    if ( this.auth.authenticated()) {
      this.auth.reloadProfile()
        .then( (profile: any) => {

        });
    }
  }
}
