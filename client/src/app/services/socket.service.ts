import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';

declare const io: any;

@Injectable()
export class SocketService {

  socket: any;
  editRef: any;
  userNum = 0;
  users: Object = {};
  sessionId = new BehaviorSubject<string>('public');
  chatMsgReceived = new BehaviorSubject<string>('');
  userListReceived = new BehaviorSubject<string>('');

  test_Socketinit = false;

  constructor() { }

  getSessionId() {
    return this.sessionId.asObservable();
  }

  // socketInit(sessionId: string, userId: string, userEmail: string) {
  //   if ( this.test_Socketinit === false ) {
  //     this.test_Socketinit = true;
  //     console.log(window.location.origin);
  //     this.socket = io('localhost:3000', {query: `sessionId=${sessionId}&userName=${userId}&userEmail=${userEmail}`});
  //     console.log('[*] socketInit... done');
  //     this.socketListenChat();
  //     this.socketListenUserList();
  //   }
  // }


  socketInit(userId: string, userEmail: string, userPic: string) {
    console.log(window.location.origin);
    this.socket = io('localhost:3000', {query: `userName=${userId}&userEmail=${userEmail}&userPic=${userPic}`});
    console.log('[*] socketInit... done');
    this.socketListenChat();
    this.socketListenUserList();
  }

  socketCreateDoc(sessionId: string): void {
    const payload = {
      sessionId: sessionId
    };
    this.socket.emit('clientCreateSession', JSON.stringify(payload));
  }

  socketJoinSession(sessionId: string): void {
    this.socket.emit('clientJoinSession', sessionId);

  }

  subscribeNewChatMsg(): Observable<string> {
    return this.chatMsgReceived.asObservable();
  }

  subscribeUserList(): Observable<string> {
    return this.userListReceived.asObservable();
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

  socketSendMsgChat(msg: string, userId: string): void {
    const msgObj: object = {
      user: userId,
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
    this.socket.on('serverSendEditorChangesHistory', (deltaAryStr: string) => {
      if (deltaAryStr) {
        const deltaAry: Array<string> = JSON.parse(deltaAryStr);
        console.log('[v] EditorChangesHistory received: \n' + deltaAryStr);


        for (let i = 0; i < deltaAry.length; i++) {
          editor.updateContents(JSON.parse(deltaAry[i]));
        }
      }
    });
  }



  disconnect(): void {
    this.socket.disconnect();
  }
}
