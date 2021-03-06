import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgLoadingBarModule } from 'ng-loading-bar';
import { NgClass } from '@angular/common';


import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { MainComponent } from './components/main/main.component';
import { EditorComponent } from './components/editor/editor.component';


import { SocketService } from './services/socket.service';
import { DocsService } from './services/docs.service';
import { AuthService } from './services/auth.service';
import { StartComponent } from './components/start/start.component';
import { routing } from './app.routes';
import { NavComponent } from './components/nav/nav.component';
import { AboutComponent } from './components/about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    MainComponent,
    EditorComponent,
    StartComponent,
    NavComponent,
    AboutComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    NgLoadingBarModule.forRoot(),
  ],
  providers: [
    {
      provide: 'socket',
      useClass: SocketService
    },
    {
      provide: 'docs',
      useClass: DocsService
    },
    {
      provide: 'auth',
      useClass: AuthService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
