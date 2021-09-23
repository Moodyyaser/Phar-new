import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTable} from '@angular/material/table';
import { PeriodicElement } from '../elements.model';
import {Sort} from '@angular/material/sort';

import {TableService} from '../table.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {

  saved = false;
  import_number = 0;
  load_number = 0;
  table_length = 0;
  table_length_prev = this.table_length;
  constructor(private tableService: TableService) {
    this.sortedData = this.Table_array.slice();}

  ngOnInit() {
    this.load(0);
  }

  hide_saved() {this.saved = false;}

  company_suppliers = ["Kuwait Co.", "Knoll"];

  //Date format in Javascript is yyyy\dd\mm but will be displayed as mm/dd/yyyy
  //Highlighted date is today's date
  date_index: Date = new Date();
  supplier_index = "";

  //Table elements --------------------------------------------------------------------
  ELEMENT_DATA: PeriodicElement[] = [];
  Table_array = this.ELEMENT_DATA;
  sortedData: PeriodicElement[] = this.Table_array.slice();

  displayedColumns = ['id', 'name', 'weight', 'amount', 'price', 'total', 'delete'];

  @ViewChild(MatTable) table!: MatTable<any>;

  delete(id: PeriodicElement) {
    if (confirm("Are you sure you wish to delete this?")) {
      const index = this.Table_array.indexOf(id);
      this.table_length-=1;
      this.Table_array.splice(index, 1);
      this.sortedData = this.Table_array.slice();
      this.table.renderRows();
    }
  }

  ngAfterViewInit() {
    // this.Table_array.sort = this.sort;
    // this.Table_array.paginator = this.paginator;
  }

  getTotalCost() {
    return this.Table_array.map(t => (t.price*t.amount) || 0).reduce((acc, value) => acc + value, 0);
  }

  save() {
    this.tableService.updateElements(this.Table_array[this.import_number])
      .subscribe(() => {
          this.saved = true;
          setTimeout(this.hide_saved, 5000);
          //Save
          const te = this.import_number.toString();
          localStorage.setItem("buylength_"+te , this.table_length.toString());
          localStorage.setItem("buydate_"+te   , this.date_index.toString());
          localStorage.setItem("buycompany_"+te, this.supplier_index);
          for (let i=0; i<this.table_length; i+=1) {
            localStorage.setItem("buyname"  +i.toString()+"_"+te, this.Table_array[i].name);
            localStorage.setItem("buyweight"+i.toString()+"_"+te, this.Table_array[i].weight.toString());
            localStorage.setItem("buyamount"+i.toString()+"_"+te, (this.Table_array[i].amount || 0).toString());
            localStorage.setItem("buyprice" +i.toString()+"_"+te, this.Table_array[i].price.toString());
          }

          for (let i=this.table_length; i<this.table_length_prev; i+=1) {
            localStorage.removeItem("buyname"  +i.toString()+"_"+te);
            localStorage.removeItem("buyweight"+i.toString()+"_"+te);
            localStorage.removeItem("buyamount"+i.toString()+"_"+te);
            localStorage.removeItem("buyprice" +i.toString()+"_"+te);
          }
          this.table_length_prev = this.table_length;
        });
  }

  //Load
  load(num: number) {
    this.tableService.getElements()
      .subscribe(() => {
          const te = this.load_number.toString();
          this.table_length=parseInt(localStorage.getItem("buylength_"+te) || "0");
          this.date_index=new Date(localStorage.getItem("buydate_"+te) || "");
          this.supplier_index=localStorage.getItem("buycompany_"+te) || this.company_suppliers[0];
          this.Table_array = [];
          for (let i=0; i<this.table_length; i+=1) {
            this.Table_array.push({
              id: i,
              name:   localStorage.getItem("buyname"+i.toString()+"_"+te) || "",
              weight: parseFloat(localStorage.getItem("buyweight"+i.toString()+"_"+te) || "0"),
              amount: parseFloat(localStorage.getItem("buyamount"+i.toString()+"_"+te) || "0"),
              price:  parseFloat(localStorage.getItem("buyprice" +i.toString()+"_"+te) || "0"),
            })
          }
          this.table_length_prev = this.table_length;
          this.sortedData = this.Table_array.slice();
          this.import_number = this.load_number;
          this.table.renderRows();
        });
  }

  //Sort
  sortData(sort: Sort) {
    const data = this.Table_array.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(a.id, b.id, isAsc);
        case 'weight': return compare(a.weight, b.weight, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'amount': return compare(a.amount, b.amount, isAsc);
        case 'price': return compare(a.price, b.price, isAsc);
        case 'total': return compare(a.price*a.amount, b.price*b.amount, isAsc);
        default: return 0;
      }
    });
  }

  //Items when you add elements
  items_to_add = [
    'Hydrogen'  ,
    'Helium'    ,
    'Lithium'   ,
    'Beryllium' ,
    'Boron'     ,
    'Carbon'    ,
    'Nitrogen'  ,
    'Oxygen'    ,
    'Fluorine'  ,
    'Neon'      ,
    'Sodium'    ,
    'Magnesium' ,
    'Aluminum'  ,
    'Silicon'   ,
    'Phosphorus',
    'Sulfur'    ,
    'Chlorine'  ,
    'Argon'     ,
    'Potassium' ,
    'Calcium'   ,];

    addElement(element: string) {
      let str_weight = 0;
      let str_price = 0;
      switch (element) {
        case 'Hydrogen'  : str_weight=1.0079 ; str_price=2.50 ; break;
        case 'Helium'    : str_weight=4.0026 ; str_price=20.13; break;
        case 'Lithium'   : str_weight=6.941  ; str_price=4.24 ; break;
        case 'Beryllium' : str_weight=9.0122 ; str_price=5.45 ; break;
        case 'Boron'     : str_weight=10.811 ; str_price=10.23; break;
        case 'Carbon'    : str_weight=12.0107; str_price=1    ; break;
        case 'Nitrogen'  : str_weight=14.0067; str_price=2.00 ; break;
        case 'Oxygen'    : str_weight=15.9994; str_price=50   ; break;
        case 'Fluorine'  : str_weight=18.9984; str_price=54.15; break;
        case 'Neon'      : str_weight=20.1797; str_price=5.81 ; break;
        case 'Sodium'    : str_weight=22.9898; str_price=34.6 ; break;
        case 'Magnesium' : str_weight=24.305 ; str_price=4.63 ; break;
        case 'Aluminum'  : str_weight=26.9815; str_price=2.87 ; break;
        case 'Silicon'   : str_weight=28.0855; str_price=2.13 ; break;
        case 'Phosphorus': str_weight=30.9738; str_price=60   ; break;
        case 'Sulfur'    : str_weight=32.065 ; str_price=0.04 ; break;
        case 'Chlorine'  : str_weight=35.453 ; str_price=3.33 ; break;
        case 'Argon'     : str_weight=39.948 ; str_price=0.11 ; break;
        case 'Potassium' : str_weight=39.0983; str_price=4.13 ; break;
        case 'Calcium'   : str_weight=40.078 ; str_price=0.34 ; break;
      }
      this.Table_array.push({
        id: this.table_length,
        name:   element,
        weight: str_weight,
        amount: 0,
        price:  str_price,
      });
      this.table_length+=1;
      this.sortedData = this.Table_array.slice();
      this.table.renderRows();
    }

  string_format(num: number) {return num.toFixed(2);}
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
