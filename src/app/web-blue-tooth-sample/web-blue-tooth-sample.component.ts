import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-web-blue-tooth-sample',
  templateUrl: './web-blue-tooth-sample.component.html',
  styleUrls: ['./web-blue-tooth-sample.component.scss'],
})
export class WebBlueToothSampleComponent implements OnInit {
  device: any;
  deviceInfo: any;
  returnedValues = [];
  error: any;
  serviceUuid = new FormControl('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
  command = new FormControl('0x0200000000000000000000000000000000000000');

  constructor() {}

  ngOnInit(): void {}

  async connectDevice() {
    let mobileNavigatorObject: any = window.navigator;
    try {
      this.error = null;
      const device = await mobileNavigatorObject.bluetooth.requestDevice({
        filters: [
          {
            services: [this.serviceUuid.value],
          },
        ],
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(this.serviceUuid.value);
      const WriteCharacteristic = await service.getCharacteristic(
        '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
      );
      console.log('write: ', WriteCharacteristic);

      const ReadCharacteristic = await service.getCharacteristic(
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      );

      const startNoti = await ReadCharacteristic.startNotifications();

      WriteCharacteristic.writeValue(this.hexToString(this.command.value));

      let characteristicValue;

      startNoti.addEventListener('characteristicvaluechanged', (event: any) => {
        characteristicValue = ReadCharacteristic.value;
        console.log('read: ', characteristicValue);
        this.returnedValues.push(
          this.buf2hex(new Uint8Array(characteristicValue.buffer))
        ),
          console.log('returned: ', this.returnedValues);
        device.gatt.disconnect();
      });
    } catch (error) {
      this.returnedValues = [];
      this.error = error;
      console.log(error);
    }
  }

  private hexToString(string: string): ArrayBuffer {
    string = string.slice(2);
    const bytes = new Uint8Array(Math.ceil(string.length / 2));
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(string.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  // // tslint:disable-next-line: typedef
  private createHexString(arr) {
    let result = '';
    let z;

    for (let i = 0; i < arr.length; i++) {
      let str = arr[i].toString(16);

      z = 8 - str.length + 1;
      str = Array(z).join('0') + str;

      result += str;
    }

    return result;
  }

  buf2hex(buffer) {
    // buffer is an ArrayBuffer
    let hex = Array.prototype.map
      .call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
      .join('');

    return `0x${hex}`;
  }
}
