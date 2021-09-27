import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

//Materials
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PurchasesComponent } from "./purchases/purchases.component";
import { AppRoutingModule } from "./app-routing.module";

import { MatSortModule } from "@angular/material/sort";
import { SalesComponent } from "./sales/sales.component";
import { CreateComponent } from "./create/create.component";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDataService } from "./in-memory-data.service";

@NgModule({
    declarations: [
        AppComponent,
        PurchasesComponent,
        SalesComponent,
        CreateComponent
    ],
    imports: [
        MatTableModule,
        MatButtonModule,
        MatToolbarModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatDialogModule,
        MatDividerModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSortModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,

        HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
            dataEncapsulation: false
        })
    ],
    providers: [PurchasesComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
