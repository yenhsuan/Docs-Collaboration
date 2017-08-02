import { Injectable, Inject } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
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
  loadingProfile = false;

  // nickname = new BehaviorSubject<string>('');

  // constructor(private router: Router, private http: Http) {
  // }

  constructor(@Inject('socket') private socket, private http: Http, private router: Router) {
    this.lock.on('authenticated', authResult => {
      this.loadingProfile = true;
      this.lock.getUserInfo( authResult.accessToken, (error, profile) => {
          this.loadingProfile = false;
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
          // resolve(profile);
          // this.router.navigate(['/ugihuih']);

          const userName = profile.username;
          const userEmail = profile.email;
          const userPic = profile.picture;

          this.socket.setUserName(userName);
          this.socket.setUserEmail(userEmail);
          this.socket.setUserPic(userPic);

          this.router.navigate(['/start']);
          setTimeout( () => {this.lock.hide()}, 1300) ;

       });
      });
  }

  public login() {
   this.lock.show();
  }


  public authenticated() {

    // const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    // return localStorage.getItem('profile') && new Date().getTime() < expiresAt;
    return tokenNotExpired('id_token');
  }

  public reloadProfile() {
    const accessToken: string = localStorage.getItem('accessToken');
    this.loadingProfile = true;
      this.lock.getUserInfo( accessToken, (error, profile) => {
        this.loadingProfile = false;
        if (error) {
          console.log(error);
          this.logout();
          return;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        this.profile = profile;

        const userName = profile.username;
        const userEmail = profile.email;
        const userPic = profile.picture;

        this.socket.setUserName(userName);
        this.socket.setUserEmail(userEmail);
        this.socket.setUserPic(userPic);
        // console.log('here');
        // this.router.navigate(['/ugihuih']);
     });
  }

  public logout() {
    // Remove token from localStorage
    this.profile = {};
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    // localStorage.removeItem('expires_at');
    localStorage.removeItem('id_token')
    this.router.navigate(['/']);
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


