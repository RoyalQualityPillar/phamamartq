
import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareHostDataService {
  private _selectedRowInterfaceData: any;
  private _currentStage: any;
  private _selectedStage: any;
  private _currentSelectedMenu: any;
  private _selectedData: any;

  constructor() {
    /***************************************************************************************** */
    // Listen for remote's request to get the latest data
    fromEvent(window, 'onRELoad').subscribe(() => {
      console.log('[Host] Received onRELoad request');
      this.sendSelectedRowData();
      this.currentStageData();
      this.selectedStageData();
      this.currentSelectedMenuData(); 
      this.selectedDataChange()
    });
    // fromEvent(window, 'onRELoad').subscribe(() => {
    //     console.log('[Host] Received onRELoad request');
    //     this.currentStageData();
    //   });
    //   fromEvent(window, 'onRELoad').subscribe(() => {
    //     console.log('[Host] Received onRELoad request');
    //     this.selectedStageData();
    //   });
  }
/**************************************************************************************** */
  // Setter
  set selectedRowInterfaceData(data: any) {
    console.log('[Host] Setting selectedRowInterfaceData:', data);
    if (JSON.stringify(this._selectedRowInterfaceData) !== JSON.stringify(data)) {
      this._selectedRowInterfaceData = data;
      this.sendSelectedRowData();
    }
  }
  set currentStage(data: any) {
    console.log('[Host] Setting currentStage:', data);
    if (JSON.stringify(this._currentStage) !== JSON.stringify(data)) {
      this._currentStage = data;
      this.currentStageData();
    }
  }
  set selectedStage(data: any) {
    console.log('[Host] Setting _selectedStage:', data);
    if (JSON.stringify(this._selectedStage) !== JSON.stringify(data)) {
      this._selectedStage = data;
      this.selectedStageData();
    }
  }
  set currentSelectedMenu(data: any) { // ✅ NEW
    console.log('[Host] Setting currentSelectedMenu:', data);
    if (JSON.stringify(this._currentSelectedMenu) !== JSON.stringify(data)) {
      this._currentSelectedMenu = data;
      this.currentSelectedMenuData();
    }
}
set selectedData(data: any) {
  console.log('[Host] Setting selectedData:', data);
  if (JSON.stringify(this._selectedData) !== JSON.stringify(data)) {
    this._selectedData = data;
    this.selectedDataChange();
  }
}
/****************************************************************************************** */
  // Getter
  get selectedRowInterfaceData(): any {
    console.log('[Host] Getting selectedRowInterfaceData:', this._selectedRowInterfaceData);
    return this._selectedRowInterfaceData;
  }
  get currentStage(): any {
    console.log('[Host] Getting currentStage:', this._currentStage);
    return this._currentStage;
  }
  get selectedStage(): any {
    console.log('[Host] Getting _selectedStage:', this._selectedStage);
    return this._selectedStage;
  }
  get currentSelectedMenu(): any { // ✅ NEW
    console.log('[Host] Getting currentSelectedMenu:', this._currentSelectedMenu);
    return this._currentSelectedMenu;
  }
  get selectedData(): any {
    console.log('[Host] Getting selectedData:', this._selectedData);
    return this._selectedData;
  }
  
/************************************************************************************ */
  // Emit data to all listeners (like remote app)
  private sendSelectedRowData() {
    const event = new CustomEvent('selectedRowInterfaceDataChange', {
      detail: this._selectedRowInterfaceData,
    });
    window.dispatchEvent(event);
  }
  private currentStageData() {
    const event = new CustomEvent('currentStageChange', {
      detail: this._currentStage,
    });
    window.dispatchEvent(event);
  }
  private selectedStageData() {
    const event = new CustomEvent('selectedStageChange', {
      detail: this._selectedStage,
    });
    window.dispatchEvent(event);
  }
  private currentSelectedMenuData() { // ✅ NEW
    const event = new CustomEvent('currentSelectedMenuChange', {
      detail: this._currentSelectedMenu,
    });
    window.dispatchEvent(event);
  }
  private selectedDataChange() {
    const event = new CustomEvent('selectedDataChange', {
      detail: this._selectedData,
    });
    window.dispatchEvent(event);
  }
}

