import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material/table";
import { PharmaticElement } from "../elements.model";
import { HttpClient } from "@angular/common/http";
import { Sort } from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';

import { TableService } from "../table.service";
import { CreateMedicineDialog } from './create-medicine-dialog';
import { CreateBuyerDialog } from './create-buyer-dialog';

@Component({
    selector: "app-sales",
    templateUrl: "./sales.component.html",
    styleUrls: ["./sales.component.css"]
})
export class SalesComponent implements OnInit {
  saved = 0;
  export_number = 0;
  load_number = 0;
  table_length_prev    = 0;
  company_length_prev  = 0;
  medicine_length_prev = 0;

  constructor(private tableService: TableService, public dialog: MatDialog, private http: HttpClient) {
      this.sortedData = this.Table_array.slice();
  }

  ngOnInit() {
      this.load(0);
  }

  hide_saved() {
      this.saved = 0;
  }

  company_buyers: string[] = [];

  //Date format in Javascript is yyyy\dd\mm but will be displayed as mm/dd/yyyy
  //Highlighted date is today's date
  date_index: Date = new Date();
  buyer_index = "";

  //Table medicines --------------------------------------------------------------------
  ELEMENT_DATA: PharmaticElement[] = [];
  Table_array = this.ELEMENT_DATA;
  sortedData: PharmaticElement[] = this.Table_array.slice();

  displayedColumns = [
    "id",
    "name",
    "capsulent",
    "tablets",
    "price",
    "total",
    "delete"
  ];

  @ViewChild(MatTable) table!: MatTable<any>;

  createMedicine() {
    const dialogRef = this.dialog.open(CreateMedicineDialog, {
      width: '280px',
      data: { name: '', price: 0 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.items_to_add.push({
          name: result.name,
          price: result.price
        });
      }
    });
  }

  addCompany() {
    const dialogRef = this.dialog.open(CreateBuyerDialog, {
      width: '280px',
      data: ""
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.company_buyers.push(result);
      }
    });
  }

  deleteCompany(company: string) {
    if (confirm("Are you sure you wish to delete "+company+"?")) {
      const index = this.company_buyers.indexOf(company);
      this.company_buyers.splice(index, 1);
    }
  }

  deleteMedicine(element: any) {
    if (confirm("Are you sure you wish to delete "+element.name+"?")) {
      const index = this.items_to_add.indexOf(element);
      this.items_to_add.splice(index, 1);
    }
  }

  delete(id: PharmaticElement) {
      if (confirm("Are you sure you wish to delete this?")) {
          const index = this.Table_array.indexOf(id);
          this.Table_array.splice(index, 1);
          this.sortedData = this.Table_array.slice();
          this.table.renderRows();
      }
  }

  getTotalCost() {
      return this.Table_array.map(
          (t) => t.price * t.tablets * t.capsulent || 0
      ).reduce((acc, value) => acc + value, 0);
  }

  save() {
    const userId = localStorage.getItem("userId");
    if (userId == null) {
      this.saved = 2;
      return;
    }
    if (this.Table_array.length==0) {
      this.saved = 3;
      return;
    }
    this.saved = 1;
    setTimeout(this.hide_saved, 5000);

    //Save the metadata
    const te = this.export_number.toString();
    localStorage.setItem(userId+"selllength_" + te,  this.Table_array.length.toString());
    localStorage.setItem(userId+"selldate_" + te,    this.date_index.toString());
    localStorage.setItem(userId+"sellcompany_" + te, this.buyer_index);

    for (let i = 0; i < this.company_buyers.length; i++) {
      localStorage.setItem(userId+'_sellcompanyn'+i, this.company_buyers[i])
    };

    //Save the medicines data
    for (let i = 0; i < this.Table_array.length; i++) {
      localStorage.setItem(userId+"sellname"     +i+"_"+te,  this.Table_array[i].name);
      localStorage.setItem(userId+"selltablets"  +i+"_"+te, (this.Table_array[i].tablets || 0).toString());
      localStorage.setItem(userId+"sellcapsulent"+i+"_"+te, (this.Table_array[i].capsulent || 0).toString());
      localStorage.setItem(userId+"sellprice"    +i+"_"+te,  this.Table_array[i].price.toString());
    }

    //Save the created medicines
    for (let i = 0; i < this.items_to_add.length; i++) {
      localStorage.setItem(userId+'_sellmname'  +i, this.items_to_add[i].name);
      localStorage.setItem(userId+'_sellmprice' +i, this.items_to_add[i].price.toString());
    }

    //Remove the deleted medicines
    for (let i = this.Table_array.length; i < this.table_length_prev; i++) {
      localStorage.removeItem(userId+"sellname"     +i+"_"+te);
      localStorage.removeItem(userId+"selltablets"  +i+"_"+te);
      localStorage.removeItem(userId+"sellcapsulent"+i+"_"+te);
      localStorage.removeItem(userId+"sellprice"    +i+"_"+te);
    }
    this.table_length_prev = this.Table_array.length;

    //Remove the deleted companies
    for (let i = this.company_buyers.length; i < this.company_length_prev; i += 1) {
      localStorage.removeItem(userId+'_sellcompanyn'+i);
    }
    this.company_length_prev = this.company_buyers.length;

    //Remove the deleted created medicines
    for (let i = this.items_to_add.length; i < this.medicine_length_prev; i += 1) {
      localStorage.removeItem(userId+'_sellename'  +i);
      localStorage.removeItem(userId+'_selleweight'+i);
      localStorage.removeItem(userId+'_selleprice' +i);
    }
    this.medicine_length_prev = this.items_to_add.length;
  }

  //Load
  load(num: number) {
    this.tableService.getElements().subscribe(() => {
      const userId = localStorage.getItem("userId");
      if (userId == null) {
        return;
      }
      const te = this.load_number.toString();
      //Load metadata
      let table_length = parseInt(localStorage.getItem(userId+"selllength_" + te) || "0");
      this.date_index  = new Date(localStorage.getItem(userId+"selldate_" + te) || "");
      this.buyer_index = localStorage.getItem(userId+"sellcompany_" + te) || this.company_buyers[0];

      let i=0;
      this.company_buyers = [];

      //Load companies
      while (true) {
        const co_name= localStorage.getItem(userId+'_sellcompanyn'+i);
        if (co_name==null) break;
        else {
          this.company_buyers.push(localStorage.getItem(userId+'_sellcompanyn'+i) as string);
          i++;
        }
      }

      //Load created medicines
      i=0;
      this.items_to_add = [];
      while (true) {
        const co_name= localStorage.getItem(userId+'_sellename'+i);
        if (co_name==null) break;
        else {
          this.items_to_add.push({
            name:              localStorage.getItem(userId+'_sellename'  +i) as string,
            price:  parseFloat(localStorage.getItem(userId+'_selleprice' +i) as string),
          });
          i++;
        }
      }

      //If no medicines found (new savefile) load default preset
      if (i==0) {
        this.items_to_add = [
          {name: "Dorofen"         , price: 0.1},
          {name: "Alphintern"      , price: 0.25},
          {name: "Amocerebral Plus", price: 0.032},
          {name: "Garamycin"       , price: 1.614},
          {name: "Davalindi"       , price: 0.086},
          {name: "E-MOX"           , price: 0.1},
          {name: "Spasmodigestin"  , price: 0.145},
          {name: "Minalax"         , price: 0.025},
          {name: "Voltaren"        , price: 0.132},
          {name: "Dramenex"        , price: 0.5},
        ];
      }

      this.Table_array = [];
      for (let i = 0; i < table_length; i += 1) {
        this.Table_array.push({
          id: i,
          name:                 localStorage.getItem(userId+"sellname"      +i+"_"+te) || "",
          capsulent: parseFloat(localStorage.getItem(userId+"sellcapsulent" +i+"_"+te) || "0"),
          tablets:   parseFloat(localStorage.getItem(userId+"selltablets"   +i+"_"+te) || "0"),
          price:     parseFloat(localStorage.getItem(userId+"sellprice"     +i+"_"+te) || "0")
        });
      }
      this.table_length_prev = table_length;
      this.company_length_prev = this.company_buyers.length;
      this.medicine_length_prev = this.items_to_add.length;
      this.sortedData = this.Table_array.slice();
      this.export_number = this.load_number;
      this.table.renderRows();
    });
  }

  //Sort
  sortData(sort: Sort) {
    const data = this.Table_array.slice();
    if (!sort.active || sort.direction === "") {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "id":      return compare(a.id, b.id, isAsc);
        case "name":    return compare(a.name, b.name, isAsc);
        case "tablets": return compare(a.tablets, b.tablets, isAsc);
        case "price":   return compare(a.price, b.price, isAsc);
        case "total":   return compare(a.price * a.tablets * a.capsulent, b.price * b.tablets * b.capsulent, isAsc);
        default:        return 0;
      }
    });
  }

  //Items when you add medicines
  items_to_add: { name: string; price: number; }[]  = [];

  addMedicine(element: any) {
    let table_length= this.Table_array.length;
    this.Table_array.push({
      id: table_length,
      name: element.name,
      capsulent: 0,
      tablets: 0,
      price: element.price
    });
    this.sortedData = this.Table_array.slice();
    this.table.renderRows();
  }

  floor(num: number) {
      return Math.floor(num);
  }

  string_format(num: number) {
      return num.toFixed(2);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
