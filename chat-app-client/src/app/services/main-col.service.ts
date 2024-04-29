import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainColService {

  public currentMainTab$ = new Subject<any> ();
  public currentMainTabId$ = new Subject<any> ();
  private currentId = "";
  private currentMainTab = 0;
  constructor() { }

  switchTab(tab: number, id: string) {
    // 1 - profle
    // 3 - conversation
    this.currentId = id;
    this.currentMainTab = tab;
    this.currentMainTab$.next(tab);
    this.currentMainTabId$.next(id);
  }

  getCurrentMainTab() {
    return this.currentMainTab;
  }
  getCurrentTabId() {
    return this.currentId;
  }

}
