import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlexModalService } from '../shared-components/flex-modal/flex-modal.service';
import { Http } from '@angular/http';

interface IOrder {
  pid: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  orders: Array<IOrder> = [];
  nameInput = '';
  errorMessage = '';
  confirmMessage = '';

  constructor(
    private router: Router,
    private flexModal: FlexModalService,
    private http: Http
  ) {
  }


  async ngOnInit() {

  }

  calculate() {
    console.log('nameInput', this.nameInput);

    let subTotal, total, taxAmt;
    total = this.orders.reduce((acc, it, i, arr) => {
      acc += it.price * it.quantity;
      return acc;
    }, 0);
    taxAmt = total * .15;
    subTotal = total - taxAmt;

    if (this.nameInput === '' && total === 0) {
      this.errorMessage = 'Name and calculations must be made before continuing!';
      this.flexModal.openDialog('error-modal');
    } else if (this.nameInput === '') {
      this.errorMessage = 'Name must not be empty!';
      this.flexModal.openDialog('error-modal');
      // alert('Name must not be empty!');
    } else if (this.nameInput.indexOf(',') === -1) {
      // alert('Must have a comma!');
      this.errorMessage = 'Name must have a comma!';
      this.flexModal.openDialog('error-modal');
    } else if (total === 0) {
      this.errorMessage = 'Calculations must be made before continuing';
      this.flexModal.openDialog('error-modal');
    } else {
      console.log('total ->', total, 'subtotal>', subTotal, 'taxAmt>', taxAmt);
      // alert(`thank you ${this.nameInput}`);
      this.confirmMessage = `Thank you for your order ${this.nameInput}. Your Subtotal:$${subTotal}, Tax:$${taxAmt}, Grand Total:$${total}`;
      this.flexModal.openDialog('confirm-modal');
    }
  }

  clear() {
    this.orders.forEach((item, i) => {
      item.quantity = null;
      item.price = null;
      item.pid = null;
      item.description = null;
    });
  }

  addItem(item: string) {
    switch (item) {
      case 'android':
        this.orders.unshift({
          'pid': '1',
          'image': 'assets/sm_android.jpeg',
          'description': 'Android',
          'price': 150.00,
          'quantity': 1
        });
        break;
      case 'Iphone':
        this.orders.unshift({
          'pid': '2',
          'image': 'assets/sm_iphone.jpeg',
          'description': 'IPhone',
          'price': 200.00,
          'quantity': 1
        });
        break;
      case 'windows phone':
        this.orders.unshift({
          'pid': '3',
          'image': 'assets/sm_windows.jpeg',
          'description': 'Windows Phone',
          'price': 110.00,
          'quantity': 1
        });
        break;
    }
  }

  delete (index: number) {
    console.log('index', index);
    this.orders.splice(index, 1);
  }

  async readFile() {
    const rows = await this.http.get('assets/orders.json').toPromise();
    console.log('rows', rows.json());
    this.orders = rows.json();
    return rows.json();
  }

}
