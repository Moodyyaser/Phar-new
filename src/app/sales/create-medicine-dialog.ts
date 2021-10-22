import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
    name: string;
    weight: number;
    price: number;
}

@Component({
    templateUrl: "create-medicine-dialog.html"
})
export class CreateMedicineDialog {
    constructor(
        public dialogRef: MatDialogRef<CreateMedicineDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    onNoClick() {
        this.dialogRef.close();
    }
}
