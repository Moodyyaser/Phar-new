import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    templateUrl: "create-buyer-dialog.html"
})
export class CreateBuyerDialog {
    constructor(
        public dialogRef: MatDialogRef<CreateBuyerDialog>,
        @Inject(MAT_DIALOG_DATA) public data: ""
    ) {}

    onNoClick() {
        this.dialogRef.close();
    }
}
