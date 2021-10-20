import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    templateUrl: "upload-purchases-dialog.html"
})
export class UploadPurchasesDialog {
    constructor(
        public dialogRef: MatDialogRef<UploadPurchasesDialog>,
        @Inject(MAT_DIALOG_DATA) public data: ""
    ) {}

    onNoClick() {
        this.dialogRef.close();
    }
}
