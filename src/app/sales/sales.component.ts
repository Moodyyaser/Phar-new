import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTable} from '@angular/material/table';
import { PharmaticElement } from '../elements.model';
import {Sort} from '@angular/material/sort';

import {TableService} from '../table.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  saved = false;
  export_number = 0;
  load_number = 0;
  table_length = 0;
  table_length_prev = this.table_length;
  constructor(private tableService: TableService) {
    this.sortedData = this.Table_array.slice();}

  ngOnInit() {
    this.load(0);
  }

  hide_saved() {this.saved = false;}

  company_buyers = ["Alzahra", "Amana", "Abdallah shahat", "Delmar & Atallah"];

  //Date format in Javascript is yyyy\dd\mm but will be displayed as mm/dd/yyyy
  //Highlighted date is today's date
  date_index: Date = new Date();
  buyer_index = "";

  //Table elements --------------------------------------------------------------------
  ELEMENT_DATA: PharmaticElement[] = [];
  Table_array = this.ELEMENT_DATA;
  sortedData: PharmaticElement[] = this.Table_array.slice();

  displayedColumns = ['id', 'name', 'capsulent', 'tablets', 'price', 'total', 'delete'];

  @ViewChild(MatTable) table!: MatTable<any>;

  delete(id: PharmaticElement) {
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
    return this.Table_array.map(t => (t.price*t.tablets*t.capsulent) || 0).reduce((acc, value) => acc + value, 0);
  }

  save() {
    this.tableService.updateSales(this.Table_array[this.export_number])
      .subscribe(() => {
          this.saved = true;
          setTimeout(this.hide_saved, 5000);
          //Save
          const te = this.export_number.toString();
          localStorage.setItem("selllength_"+te , this.table_length.toString());
          localStorage.setItem("selldate_"+te   , this.date_index.toString());
          localStorage.setItem("sellcompany_"+te, this.buyer_index);
          for (let i=0; i<this.table_length; i+=1) {
            localStorage.setItem("sellname"  +i.toString()+"_"+te, this.Table_array[i].name);
            localStorage.setItem("selltablets"+i.toString()+"_"+te, (this.Table_array[i].tablets || 0).toString());
            localStorage.setItem("sellcapsulent"+i.toString()+"_"+te, (this.Table_array[i].capsulent || 0).toString());
            localStorage.setItem("sellprice" +i.toString()+"_"+te, this.Table_array[i].price.toString());
          }

          for (let i=this.table_length; i<this.table_length_prev; i+=1) {
            localStorage.removeItem("sellname"  +i.toString()+"_"+te);
            localStorage.removeItem("selltablets"+i.toString()+"_"+te);
            localStorage.removeItem("sellcapsulent"+i.toString()+"_"+te);
            localStorage.removeItem("sellprice" +i.toString()+"_"+te);
          }
          this.table_length_prev = this.table_length;
        });
  }

  //Load
  load(num: number) {
    this.tableService.getElements()
      .subscribe(() => {
          const te = this.load_number.toString();
          this.table_length=parseInt(localStorage.getItem("selllength_"+te) || "0");
          this.date_index=new Date(localStorage.getItem("selldate_"+te) || "");
          this.buyer_index=localStorage.getItem("sellcompany_"+te) || this.company_buyers[0];
          this.Table_array = [];
          for (let i=0; i<this.table_length; i+=1) {
            this.Table_array.push({
              id: i,
              name:   localStorage.getItem("sellname"+i.toString()+"_"+te) || "",
              capsulent: parseFloat(localStorage.getItem("sellcapsulent"+i.toString()+"_"+te) || "0"),
              tablets: parseFloat(localStorage.getItem("selltablets"+i.toString()+"_"+te) || "0"),
              price:  parseFloat(localStorage.getItem("sellprice" +i.toString()+"_"+te) || "0"),
            })
          }
          this.table_length_prev = this.table_length;
          this.sortedData = this.Table_array.slice();
          this.export_number = this.load_number;
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
        case 'name': return compare(a.name, b.name, isAsc);
        case 'tablets': return compare(a.tablets, b.tablets, isAsc);
        case 'price': return compare(a.price, b.price, isAsc);
        case 'total': return compare(a.price*a.tablets*a.capsulent, b.price*b.tablets*b.capsulent, isAsc);
        default: return 0;
      }
    });
  }

  //Items when you add elements
  items_to_add = [
    'Dorofen'         ,
    'Alphintern'      ,
    'Amocerebral Plus',
    'Garamycin'       ,
    'Davalindi'       ,
    'E-MOX'           ,
    'Spasmodigestin'  ,
    'Minalax'         ,
    'Voltaren'        ,
    'Dramenex'        ,];

    addElement(element: string) {
      let str_price = 0;
      switch (element) {
        case 'Dorofen'         : str_price=0.1  ; break;
        case 'Alphintern'      : str_price=0.25 ; break;
        case 'Amocerebral Plus': str_price=0.032; break;
        case 'Garamycin'       : str_price=1.614; break;
        case 'Davalindi'       : str_price=0.086; break;
        case 'E-MOX'           : str_price=0.1  ; break;
        case 'Spasmodigestin'  : str_price=0.145; break;
        case 'Minalax'         : str_price=0.025; break;
        case 'Voltaren'        : str_price=0.132; break;
        case 'Dramenex'        : str_price=0.5  ; break;
      }
      this.Table_array.push({
        id: this.table_length,
        name:   element,
        capsulent: 0,
        tablets: 0,
        price:  str_price,
      });
      this.table_length+=1;
      this.sortedData = this.Table_array.slice();
      this.table.renderRows();
    }

    floor(num: number) {return Math.floor(num);}

    string_format(num: number) {return num.toFixed(2);}
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
