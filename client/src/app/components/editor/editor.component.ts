import { Component, OnInit, Inject } from '@angular/core';

declare let Quill: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  quill: any;
  constructor(@Inject('socket') private socket) {

  }

  ngOnInit() {
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: '#toolbar-container'
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    });
    // this.socket.socketInit('1', 'Guest' + Math.floor((Math.random() * 100000) + 1), 'Guest@test.com');
    
    // this.editorListenEvents();

  }

  editorListenEvents(): void {

    this.quill.on('text-change', (delta: any, oldDelta: any, source: any) => {
      if (source === 'api') {
        console.log('An API call triggered this change.');
      } else if (source === 'user') {
        console.log('A user action triggered this change.');
        console.log(delta);
        this.socket.socketSendEditorChanges(delta);
      }

    });

    this.socket.socketListenEditorChanges(this.quill);
    this.socket.socketListenEditorChangesHistory(this.quill);
  }
}
