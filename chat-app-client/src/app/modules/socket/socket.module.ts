import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../../../environments/environment.development';

const config: SocketIoConfig = { url: environment.apiUrl, options: {
  reconnection: false,
  forceNew: true,
} };

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SocketIoModule.forRoot(config),
  ]
})
export class SocketModule { }
