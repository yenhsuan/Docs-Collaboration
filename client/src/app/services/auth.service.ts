import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
// import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Http, Response, Headers} from '@angular/http';

// Load auth0 lock v10

declare var Auth0Lock: any;

// Auth0 Setting

const options = {
  theme: {
    logo: '../../assets/google-docs.png',
    primaryColor: '#337ab7'
  },
  languageDictionary: {
    title: 'Log in'
  },
  rememberLastLogin: false,
  popupOptions: { width: 30, height: 40, left: 30, top: 30 },
  redirect: false,
  auth: {
      redirect: false,
      sso: false,
      responseType: 'token',
      params: {
        scope: 'openid'
      },
   }
};

@Injectable()
export class AuthService {
  // Configure Auth0
  clientId = 'Vm3mPMVF6QvqVhnH3TtlBuel0r2lRm5h';
  domain = 'terryccc.auth0.com';
  lock = new Auth0Lock(this.clientId, this.domain, options);
  profile: any;
  accessToken = '';

  // nickname = new BehaviorSubject<string>('');

  // constructor(private router: Router, private http: Http) {
  // }

  constructor(private http: Http) {
  }

  public login() {

    return new Promise( (resolve, reject) => {
      this.lock.on('authenticated', authResult => {
        this.lock.getUserInfo( authResult.accessToken, (error, profile) => {
            if (error) {
              console.log(error);
              return;
            }
            localStorage.setItem('accessToken', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            this.accessToken = authResult.accessToken;
            localStorage.setItem('profile', JSON.stringify(profile));
            this.profile = profile;
            // console.log('here');
            resolve(profile);
            // this.router.navigate(['/ugihuih']);
            setTimeout( () => {this.lock.hide()}, 1300) ;

         });
        });
     this.lock.show();
    });
  }


  public authenticated() {

    // const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    // return localStorage.getItem('profile') && new Date().getTime() < expiresAt;
    return tokenNotExpired('id_token');
  }

  public reloadProfile() {
    const accessToken: string = localStorage.getItem('accessToken');
    return new Promise ( (resolve, reject) => {
      this.lock.getUserInfo( accessToken, (error, profile) => {
        if (error) {
          console.log(error);
          return;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        this.profile = profile;

        // console.log('here');
        resolve(profile);
        // this.router.navigate(['/ugihuih']);
     });
    });
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    // localStorage.removeItem('expires_at');
    localStorage.removeItem('id_token')
    // this.router.navigate(['/']);
  }

  public getProfile(): Object {
    return this.profile;
  }




  // public updateInfo(info:string):Promise<string> {

  //   const header = new Headers();

  //   header.append('content-type','application/json');
  //   header.append('Accept','application/json');
  //   header.append('Authorization','Bearer ' + localStorage.getItem('id_token'));


  //   let url = 'https://' + 'terryccc.auth0.com' + '/api/v2/users/' + this.getProfile()['user_id'];
  //   //console.log(url);
  //   return this.http.patch(url,info,{headers: header})
  //             .toPromise()
  //             .then( (response:Response)=>
  //               response['_body']
  //             );
  // }
}


