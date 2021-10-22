import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { PeriodicElement } from '../elements.model';
import { HttpClient } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { TableService } from '../table.service';
import { CreateElementDialog } from './dialogs/create-element-dialog';
import { CreateCompanyDialog } from './dialogs/create-company-dialog';
import { UploadPurchasesDialog } from './dialogs/upload-purchases-dialog';
import { DownloadPurchasesDialog } from './dialogs/download-purchases-dialog';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
})
export class PurchasesComponent implements OnInit {
  saved = 0;
  import_number = 0;
  load_number = 0;
  table_length_prev = 0;
  company_length_prev = 0;
  elements_length_prev = 0;
  loading = true;

  constructor(
    private tableService: TableService,
    public dialog: MatDialog,
    private http: HttpClient,
  ) {
    this.sortedData = this.Table_array.slice();
  }

  ngOnInit() {
    this.load(0);
  }

  hide_saved() {
    this.saved = 0;
  }

  company_suppliers: string[] = [];

  //Date format in Javascript is yyyy\dd\mm but will be displayed as mm/dd/yyyy
  //Highlighted date is today's date
  date_index: Date = new Date();
  supplier_index = '';

  //Table elements --------------------------------------------------------------------
  ELEMENT_DATA: PeriodicElement[] = [];
  Table_array = this.ELEMENT_DATA;
  sortedData: PeriodicElement[] = this.Table_array.slice();

  displayedColumns = ['id', 'name', 'weight', 'amount', 'price', 'total', 'delete'];

  @ViewChild(MatTable) table!: MatTable<any>;

  createElement() {
    const dialogRef = this.dialog.open(CreateElementDialog, {
      width: '280px',
      data: { name: '', weight: 0, price: 0 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.items_to_add.push({
          name: result.name,
          weight: result.weight,
          price: result.price,
        });
      }
    });
  }

  addCompany() {
    const dialogRef = this.dialog.open(CreateCompanyDialog, {
      width: '280px',
      data: '',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.company_suppliers.push(result);
      }
    });
  }

  deleteCompany(company: string) {
    if (confirm('Are you sure you wish to delete ' + company + '?')) {
      const index = this.company_suppliers.indexOf(company);
      this.company_suppliers.splice(index, 1);
    }
  }

  deleteElement(element: any) {
    if (confirm('Are you sure you wish to delete ' + element.name + '?')) {
      const index = this.items_to_add.indexOf(element);
      this.items_to_add.splice(index, 1);
    }
  }

  delete(id: PeriodicElement) {
    if (confirm('Are you sure you wish to delete this?')) {
      const index = this.Table_array.indexOf(id);
      this.Table_array.splice(index, 1);
      this.sortedData = this.Table_array.slice();
      this.table.renderRows();
    }
  }

  getTotalCost() {
    return this.Table_array.map((t) => t.price * t.amount || 0).reduce(
      (acc, value) => acc + value,
      0,
    );
  }

  save() {
    const dialogRef = this.dialog.open(UploadPurchasesDialog, {
      width: '480px',
      data: { name: '', weight: 0, price: 0 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const userId = localStorage.getItem('userId');
        if (userId == null) {
          this.saved = 2;
          return;
        }
        if (this.Table_array.length == 0) {
          this.saved = 3;
          return;
        }
        //SAVE LOCALLY --------------------------------------------------------------
        if (result == 1) {
          this.saved = 1;
          setTimeout(this.hide_saved, 5000);

          //Save the metadata
          const te = this.import_number.toString();
          localStorage.setItem(userId + '_buylength_' + te, this.Table_array.length.toString());
          localStorage.setItem(userId + '_buydate_' + te, this.date_index.toString());
          localStorage.setItem(userId + '_buycompany_' + te, this.supplier_index);

          for (let i = 0; i < this.company_suppliers.length; i += 1) {
            localStorage.setItem(userId + '_buycompanyn' + i, this.company_suppliers[i]);
          }

          //Save the elements data
          for (let i = 0; i < this.Table_array.length; i += 1) {
            localStorage.setItem(userId + '_buyname' + i + '_' + te, this.Table_array[i].name);
            localStorage.setItem(
              userId + '_buyweight' + i + '_' + te,
              this.Table_array[i].weight.toString(),
            );
            localStorage.setItem(
              userId + '_buyamount' + i + '_' + te,
              (this.Table_array[i].amount || 0).toString(),
            );
            localStorage.setItem(
              userId + '_buyprice' + i + '_' + te,
              this.Table_array[i].price.toString(),
            );
          }

          //Save the created elements
          for (let i = 0; i < this.items_to_add.length; i += 1) {
            localStorage.setItem(userId + '_buyename' + i, this.items_to_add[i].name);
            localStorage.setItem(
              userId + '_buyeweight' + i,
              this.items_to_add[i].weight.toString(),
            );
            localStorage.setItem(userId + '_buyeprice' + i, this.items_to_add[i].price.toString());
          }

          //Remove the deleted elements
          for (let i = this.Table_array.length; i < this.table_length_prev; i += 1) {
            localStorage.removeItem(userId + '_buyname' + i + '_' + te);
            localStorage.removeItem(userId + '_buyweight' + i + '_' + te);
            localStorage.removeItem(userId + '_buyamount' + i + '_' + te);
            localStorage.removeItem(userId + '_buyprice' + i + '_' + te);
          }
          this.table_length_prev = this.Table_array.length;

          //Remove the deleted companies
          for (let i = this.company_suppliers.length; i < this.company_length_prev; i += 1) {
            localStorage.removeItem(userId + '_buycompanyn' + i);
          }
          this.company_length_prev = this.company_suppliers.length;

          //Remove the deleted created elements
          for (let i = this.items_to_add.length; i < this.elements_length_prev; i += 1) {
            localStorage.removeItem(userId + '_buyename' + i);
            localStorage.removeItem(userId + '_buyeweight' + i);
            localStorage.removeItem(userId + '_buyeprice' + i);
          }
          this.elements_length_prev = this.items_to_add.length;
        }
        //SAVE GLOBALLY --------------------------------------------------------------
        else if (result == 2) {
          const te = this.import_number;
          const elements = this.items_to_add;
          const table_array = this.Table_array;
          //Save the metadata
          //Pack all created elements in an array
          var element_ename = [];
          var element_eweight = [];
          var element_eprice = [];
          for (let i = 0; i < elements.length; i += 1) {
            element_ename.push(elements[i].name);
            element_eweight.push(elements[i].weight);
            element_eprice.push(elements[i].price);
          }

          //Pack all table elements in an array
          var element_name = [];
          var element_weight = [];
          var element_amount = [];
          var element_price = [];
          for (let i = 0; i < table_array.length; i += 1) {
            element_name.push(table_array[i].name);
            element_weight.push(table_array[i].weight);
            element_amount.push(table_array[i].amount);
            element_price.push(table_array[i].price);
          }

          let postData = {
            te: te,
            length: this.Table_array.length,
            date: this.date_index,
            name: this.supplier_index,
            companies: this.company_suppliers,
            element_ename: element_ename,
            element_eweight: element_eweight,
            element_eprice: element_eprice,
            element_name: element_name,
            element_weight: element_weight,
            element_amount: element_amount,
            element_price: element_price,
          };

          //Remove the previous object

          const search_query = '?creator=' + userId + '&index=' + this.load_number;
          this.http
            .get<{ message: string; posts: any }>(
              `${process.env.API_BASE_URL}/api/posts` + search_query,
            )
            .subscribe((PostData) => {
              let fetched_post = PostData.posts;

              //Load metadata

              if (fetched_post == null) {
                console.log("couldn't find a post to remove");
                //Upload
                this.http
                  .post<{ message: string }>(`${process.env.API_BASE_URL}/api/posts`, postData)
                  .subscribe(() => {
                    this.saved = 1;
                    console.log('Uploaded successfully');
                  });
              } else {
                const id = fetched_post._id;
                this.tableService.deletePost(id).subscribe(() => {
                  console.log('deleted previous data');
                  //Upload
                  this.http
                    .post<{ message: string }>(`${process.env.API_BASE_URL}/api/posts`, postData)
                    .subscribe(() => {
                      this.saved = 1;
                      console.log('Uploaded successfully');
                    });
                });
              }
            });
        }
      }
    });
  }

  //Load
  load(num: number) {
    const dialogRef = this.dialog.open(DownloadPurchasesDialog, {
      width: '400px',
      data: { name: '', weight: 0, price: 0 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const userId = localStorage.getItem('userId');
      if (result != null) {
        //LOAD LOCALLY --------------------------------------------------------------
        if (result == 1) {
          if (userId == null) {
            return;
          }
          const te = this.load_number.toString();
          //Load metadata
          let table_length = parseInt(localStorage.getItem(userId + '_buylength_' + te) || '0');
          this.date_index = new Date(localStorage.getItem(userId + '_buydate_' + te) || '');
          this.supplier_index =
            localStorage.getItem(userId + '_buycompany_' + te) || this.company_suppliers[0];

          let i = 0;
          this.company_suppliers = [];

          //Load companies
          while (true) {
            const co_name = localStorage.getItem(userId + '_buycompanyn' + i);
            if (co_name == null) break;
            else {
              this.company_suppliers.push(
                localStorage.getItem(userId + '_buycompanyn' + i) as string,
              );
              i++;
            }
          }

          //Load created elements
          i = 0;
          this.items_to_add = [];
          while (true) {
            const co_name = localStorage.getItem(userId + '_buyename' + i);
            if (co_name == null) break;
            else {
              this.items_to_add.push({
                name: localStorage.getItem(userId + '_buyename' + i) as string,
                weight: parseFloat(localStorage.getItem(userId + '_buyeweight' + i) as string),
                price: parseFloat(localStorage.getItem(userId + '_buyeprice' + i) as string),
              });
              i++;
            }
          }

          //If no elements found (new savefile) load default preset
          if (i == 0) {
            this.items_to_add = [
              { name: 'Hydrogen', weight: 1.0079, price: 2.5 },
              { name: 'Carbon', weight: 12.0107, price: 1 },
              { name: 'Nitrogen', weight: 14.0067, price: 2.0 },
              { name: 'Oxygen', weight: 15.9994, price: 50 },
            ];
          }

          this.Table_array = [];
          for (let i = 0; i < table_length; i += 1) {
            this.Table_array.push({
              id: i,
              name: localStorage.getItem(userId + '_buyname' + i + '_' + te) || '',
              weight: parseFloat(localStorage.getItem(userId + '_buyweight' + i + '_' + te) || '0'),
              amount: parseFloat(localStorage.getItem(userId + '_buyamount' + i + '_' + te) || '0'),
              price: parseFloat(localStorage.getItem(userId + '_buyprice' + i + '_' + te) || '0'),
            });
          }
          this.loading = false;
          this.table_length_prev = table_length;
          this.company_length_prev = this.company_suppliers.length;
          this.elements_length_prev = this.items_to_add.length;
          this.sortedData = this.Table_array.slice();
          this.import_number = this.load_number;
          this.table.renderRows();
        }
        //LOAD GLOBALLY --------------------------------------------------------------
        else if (result == 2) {
          const search_query = '?creator=' + userId + '&index=' + this.load_number;
          this.http
            .get<{ message: string; posts: any }>(
              `${process.env.API_BASE_URL}/api/posts` + search_query,
            )
            .subscribe((PostData) => {
              let fetched_post = PostData.posts;

              console.log(fetched_post);
              if (fetched_post == null) {
                console.log("couldn't find any post");
                this.items_to_add = [
                  { name: 'Hydrogen', weight: 1.0079, price: 2.5 },
                  { name: 'Carbon', weight: 12.0107, price: 1 },
                  { name: 'Nitrogen', weight: 14.0067, price: 2.0 },
                  { name: 'Oxygen', weight: 15.9994, price: 50 },
                ];
                this.table_length_prev = 0;
              } else {
                //Load metadata
                this.date_index = fetched_post.date;
                this.supplier_index = fetched_post.name;

                let i = 0;
                this.company_suppliers = fetched_post.companies;

                //Load created elements
                i = 0;
                this.items_to_add = [];
                while (true) {
                  const co_name = fetched_post.element_ename[i];
                  if (co_name == null) break;
                  else {
                    this.items_to_add.push({
                      name: fetched_post.element_ename[i],
                      weight: fetched_post.element_eweight[i],
                      price: fetched_post.element_eprice[i],
                    });
                    i++;
                  }
                }

                //If no elements found (new savefile) load default preset
                if (i == 0) {
                  this.items_to_add = [
                    { name: 'Hydrogen', weight: 1.0079, price: 2.5 },
                    { name: 'Carbon', weight: 12.0107, price: 1 },
                    { name: 'Nitrogen', weight: 14.0067, price: 2.0 },
                    { name: 'Oxygen', weight: 15.9994, price: 50 },
                  ];
                }

                this.Table_array = [];
                for (let i = 0; i < fetched_post.element_name.length; i += 1) {
                  this.Table_array.push({
                    id: i,
                    name: fetched_post.element_name[i],
                    weight: fetched_post.element_weight[i],
                    amount: fetched_post.element_amount[i],
                    price: fetched_post.element_price[i],
                  });
                }
                this.table_length_prev = fetched_post.element_name.length;
              }
              this.loading = false;
              this.company_length_prev = this.company_suppliers.length;
              this.elements_length_prev = this.items_to_add.length;
              this.sortedData = this.Table_array.slice();
              this.import_number = this.load_number;
              this.table.renderRows();
            });
        }
      }
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
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'weight':
          return compare(a.weight, b.weight, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        case 'price':
          return compare(a.price, b.price, isAsc);
        case 'total':
          return compare(a.price * a.amount, b.price * b.amount, isAsc);
        default:
          return 0;
      }
    });
  }

  //Items when you add elements
  items_to_add: { name: string; weight: number; price: number }[] = [];

  addElement(element: any) {
    let table_length = this.Table_array.length;
    this.Table_array.push({
      id: table_length,
      name: element.name,
      weight: element.weight,
      amount: 0,
      price: element.price,
    });
    this.sortedData = this.Table_array.slice();
    this.table.renderRows();
  }
  string_format(num: number) {
    return num.toFixed(2);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
