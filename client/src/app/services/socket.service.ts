import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';

declare const io: any;

@Injectable()
export class SocketService {

  socket: any;
  editRef: any;
  userNum = 0;
  users: Object = {};

  userName: string;
  userEmail: string;
  userPic: string;

  sessionId: string;
  chatMsgReceived = new BehaviorSubject<string>('');
  userListReceived = new BehaviorSubject<string>('');
  sessionLegal = new BehaviorSubject<boolean>(true);

  userMode = '';

  test_Socketinit = false;

  constructor() { }

  socketInit() {
    // console.log(window.location.origin);
    if (this.userName) {
      this.userPic = encodeURIComponent(this.userPic);
      console.log(this.userPic);
      this.socket = io('localhost:5566', {query: `userName=${this.userName}&userEmail=${this.userEmail}&userPic=${this.userPic}`});
      this.socketListenChat();
      this.socketListenUserList();
      this.socketListenSessionLegal();

    }
    console.log('[*] socketInit... done');
  }

  socketCreateDoc(): void {
    const payload = {
      sessionId: this.sessionId
    };
    this.socket.emit('clientCreateSession', JSON.stringify(payload));
  }

  socketJoinSession(): void {
    this.socket.emit('clientJoinSession', this.sessionId);

  }

  subscribeNewChatMsg(): Observable<string> {
    return this.chatMsgReceived.asObservable();
  }

  subscribeUserList(): Observable<string> {
    return this.userListReceived.asObservable();
  }

  subscribeSessionLegal(): Observable<boolean> {
    return this.sessionLegal.asObservable();
  }


  socketListenUserList(): void {
    this.socket.on('serverSendUsersList', (userListString) => {
      console.log('[v] UserList received: ' + userListString);
      this.userListReceived.next(userListString);
    });
  }

  socketListenChat(): void {
    this.socket.on('serverSendChatMsg', (msg: string) => {
      console.log('[v] Message received: ' + msg);
      this.chatMsgReceived.next(msg);
    });
  }

  socketListenSessionLegal(): void {
    this.socket.on('serverSendNoSession', (msg: string) => {
      console.log('[v] Message received: ' + msg);
      if ( msg === 'false') {
        this.sessionLegal.next(false);
      } 
      
      this.sessionLegal.next(true);

    });
  }


  socketSendMsgChat(msg: string): void {
    const msgObj: object = {
      user: this.userName,
      text: msg
    };

    this.socket.emit('clientSendChatMsg', JSON.stringify(msgObj));
  }

  socketSendEditorChanges(delta: any) {
    this.socket.emit('clientSendEditorChanges', JSON.stringify(delta));
  }

  socketListenEditorChanges(editor: any): void {
    this.socket.on('severSendEditorChanges', (delta: string) => {
      console.log('[v] UserList received: ');
      console.log(delta);
      editor.updateContents(JSON.parse(delta));
    });
  }

  socketListenEditorChangesHistory(editor: any): void {
    this.socket.on('serverSendSessionContent', (deltaAryStr: string) => {
      if (deltaAryStr) {
        const deltaAry: Array<string> = JSON.parse(deltaAryStr);
        console.log('[v] EditorChangesHistory received: \n');
        console.log(deltaAry);


        for (let i = 0; i < deltaAry['delta'].length; i++) {
          editor.updateContents(JSON.parse(deltaAry['delta'][i]));
        }
      }
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }


  // Instance mutators & accessors
  getUserName(): string {
    return this.userName;
  }

  getUserPic(): string {
    return this.userPic;
  }

  getUserEmail(): string {
    return this.userEmail;
  }

  setUserName(input: string): void {
    this.userName = input;
  }

  setUserEmail(input: string): void {
    this.userEmail = input;
  }

  setUserPic(input: string): void {
    this.userPic = input;
  }

  setSessionId(input: string): void {
    this.sessionId = input;
  }


  getSessionId() {
    return this.sessionId;
  }
}
