import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';

declare const io: any;

@Injectable()
export class SocketService {

  socket: any;

  userNum = 0;
  users: Object = {};
  sessionId = new BehaviorSubject<string>('public');
  chatMsgReceived = new BehaviorSubject<string>('');

  constructor() { }

  getSessionId() {
    return this.sessionId.asObservable();
  }

  socketInit(sessionId: string, userId: string, userEmail: string) {
    console.log(window.location.origin);
    this.socket = io('localhost:3000', {query: `sessionId=${sessionId}&userName=${userId}&userEmail=${userEmail}`});
    console.log('[*] socketInit... done');
    this.socketListenChat();
  }

  subscribeNewChatMsg(): Observable<string> {
    return this.chatMsgReceived.asObservable();
  }

  socketListenUserList(): void {
    this.socket.on('serverSendUsersList', (userListString) => {
      console.log('[v] Socket received: ' + userListString);
      // Todo: Subscribe
    });
  }



  socketListenChat(): void {
    this.socket.on('serverSendChatMsg', (msg: string) => {
      console.log('[v] Socket received: ' + msg);
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


  disconnect(): void {
    this.socket.disconnect();
  }
}
