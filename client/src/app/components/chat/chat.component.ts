import { Component, OnInit, Inject, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('msg') private myScrollContainer: ElementRef;

  userId = '';
  message = '';
  chatHistory: Array<object> = [];
  chatNewMsgSubscribed: Subscription;

  chatUserList: Array<object> = [];
  chatUserListSubscribed: Subscription;

  constructor(@Inject('socket') private socket, @Inject('auth') private auth) {

  }

  ngOnInit() {
    this.userId = this.auth.getProfile().username;
    this.chatNewMsgSubscribed = this.socket.subscribeNewChatMsg()
      .subscribe( (newMsg: string) => {
        if (newMsg) {
          const msg = JSON.parse(newMsg);
          this.chatHistory.push({
            user: msg['user'],
            text: msg['text']
          });
        }
      });

    this.chatUserListSubscribed = this.socket.subscribeUserList()
      .subscribe( (userList: string) => {
        if (userList) {
          const users = JSON.parse(userList);
          this.chatUserList = users;
        }
      });
  }

  sendMsg(): void {
    if (this.message !== '') {
      this.socket.socketSendMsgChat(this.message);
    }
    this.message = '';
  }

  getSessionId() {
    return this.socket.getSessionId();
  }

}
//
