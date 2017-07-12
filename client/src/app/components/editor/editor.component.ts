import { Component, OnInit, Inject } from '@angular/core';

declare let Quill: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  quill: any;
  showListHideEditor = false;
  userDocs: Array<string>;
  fileNameToSave = '';
  temp = [];
  loading = true;
  loadingList = false;

  constructor(@Inject('socket') private socket, @Inject('docs') private docs, @Inject('auth') private auth) {

  }

  ngOnInit() {
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: '#toolbar-container'
      },
      placeholder: '',
      theme: 'snow'
    });

    if (this.socket.userMode) {
      this.editorEventsActivate();
    }

    this.loadDocList();
  }

  loadFileContent(file: object) {
    this.quill.setContents( JSON.parse(file['content']) , 'user');
  }

  loadDocList() {
    // console.log(this.auth.getProfile().user_id);
    this.loading = true;
    this.docs.getDoc(this.auth.getProfile().user_id)
      .then( (obj: any) => {
         // console.log(obj);
         // this.quill.setContents( JSON.parse(obj[0].content) , 'api');
         this.userDocs = obj;
         this.loading = false;
      })
  }

  loadDoc(id: string) {
    // console.log(this.auth.getProfile().user_id);
    this.loading = true;
    this.docs.getDocContent(id)
      .then( (obj: any) => {
         this.quill.setContents( JSON.parse(obj['content']) , 'user');
         this.loading = false;
      })
  }

  loadDocListBtn() {
    // console.log(this.auth.getProfile().user_id);
    this.loadingList = true;
    this.docs.getDoc(this.auth.getProfile().user_id)
      .then( (obj: any) => {
         // console.log(obj);
         // this.quill.setContents( JSON.parse(obj[0].content) , 'api');
         this.userDocs = obj;
         this.loadingList = false;
      })
  }


  saveDoc() {
    const content = {
      name: this.fileNameToSave,
      author: this.auth.getProfile().username,
      content: JSON.stringify(this.quill.getContents()),
      uid: this.auth.getProfile().user_id
    }
    this.loading = true;
    this.temp.push(this.fileNameToSave);
    this.docs.saveDoc(content)
      .then ( (res: any) => {
        console.log(res);
        this.loading = false;
      });
  }

  deleteDoc(filename: string) {
    this.loadingList = true;
    this.docs.deleteDoc(this.auth.getProfile().user_id, filename)
      .then ( (res: any) => {
        console.log(res);
        // this.loading = false;
        this.loadDocListBtn();
      });
  }


  checkFileExist() {
    if (this.fileNameToSave === '') {
      return false;
    }

    for (let i = 0; i < this.userDocs.length; i++) {
      if ( this.fileNameToSave === this.userDocs[i]['name'] ) {
        return true;
      }
    }

    if (this.fileNameToSave in this.temp) {
      return true;
    }

    return false;

  }

  editorEventsActivate(): void {

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
