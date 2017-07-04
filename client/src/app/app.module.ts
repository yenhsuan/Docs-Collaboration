import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';

import { SocketService } from './services/socket.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    {
      provide: 'socket',
      useClass: SocketService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
