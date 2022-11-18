import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  private getInfoSave = new BehaviorSubject<number>(JSON.parse(localStorage.getItem("info-save") || "0"));
  private openPopup = new BehaviorSubject<number>(JSON.parse(localStorage.getItem("is-popup") || "0"));

  constructor() {}

  watchStorage(): Observable<any> {
    return this.getInfoSave.asObservable();
  }

  watchStoragePopup(): Observable<any> {
    return this.openPopup.asObservable();
  }

  getIsPopup() {
    return this.openPopup.value;
  }

  getCurrentSave() {
    return this.getInfoSave.value;
  }

  setIsPopup(status: number) {
    localStorage.setItem("is-popup", JSON.stringify(status));
    this.openPopup.next(status);
  }

  setCurrentSave(saveItem: number, status: boolean) {
    let currentSave = Number(this.getCurrentSave());
    if (status) {
      currentSave = Number(currentSave) + saveItem;
    } else {
      currentSave = Number(currentSave) - saveItem;
    }

    localStorage.setItem("info-save", JSON.stringify(currentSave));
    this.getInfoSave.next(currentSave);
  }

  saveUrlCurrent() {
    const urlCurrent = window.location.pathname;
    localStorage.setItem("url-current", urlCurrent);
  }
}
