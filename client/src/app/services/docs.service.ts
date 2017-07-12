import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DocsService {

  constructor(private httpObj: Http) {
  }

  getDocContent(id: string): Promise<any> {

    return this.httpObj.get(`http://localhost:5566/api/v1/file/${id}`)
            .toPromise()
            .then( (response: Response) => response.json())
            .catch(this.handleError);
  }

  getDoc(uid: string): Promise<any> {

    return this.httpObj.get(`http://localhost:5566/api/v1/filelist/${uid}`)
            .toPromise()
            .then( (response: Response) => response.json())
            .catch(this.handleError);
  }



  saveDoc(content: any): Promise<any> {
    const header = new Headers({
      'content-type': 'application/json'
    });


    return this.httpObj.post('http://localhost:5566/api/v1/savefile', content, header)
              .toPromise()
              .then( (response: Response) => {
                console.log(response.json());
                return response.json();
              })
              .catch(this.handleError);
  }

  deleteDoc(uid: string, name: string): Promise<any> {

    return this.httpObj.delete(`http://localhost:5566/api/v1/deletefile/${uid}/${name}`)
              .toPromise()
              .then( (response: Response) => {
                console.log(response.json());
                return response.json();
              })
              .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error happened!');
    return Promise.reject(error.body || error);
  }
}
