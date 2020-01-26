import {
  Component,
  Inject,
  Optional
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

interface DialogData {
  name: string;
  url: string;
}

@Component({
  selector: 'app-add-filter-dialog',
  templateUrl: './add-filter.component.html'
})
export class AddFilterDialogComponent {

  name: string;
  url: string;
  data: string;

  constructor(
    public dialogRef: MatDialogRef<AddFilterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public incoming: any) {
    console.log(incoming);
  }

  onAddClick(event) {
    // console.log('on add click', event);
    this.dialogRef.close();
  }
}
