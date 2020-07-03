import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-web-blue-tooth-sample',
  templateUrl: './web-blue-tooth-sample.component.html',
  styleUrls: ['./web-blue-tooth-sample.component.scss'],
})
export class WebBlueToothSampleComponent implements OnInit {
  device: any;
  deviceInfo: any;
  returnedValue: any;
  error: any;

  constructor() {}

  ngOnInit(): void {}

  async connectDevice() {
    try {
      this.error = null;
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'],
          },
        ],
      });
      const serviceUuid = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUuid);
      const WriteCharacteristic = await service.getCharacteristic(
        '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
      );
      console.log('write: ', WriteCharacteristic);

      const ReadCharacteristic = await service.getCharacteristic(
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      );

      const startNoti = await ReadCharacteristic.startNotifications();

      WriteCharacteristic.writeValue(
        this.hexToString('0x0200000000000000000000000000000000000000')
      );

      let characteristicValue;

      startNoti.addEventListener('characteristicvaluechanged', (event: any) => {
        characteristicValue = ReadCharacteristic.value;
        console.log('read: ', characteristicValue);
        this.returnedValue = new Uint8Array(characteristicValue.buffer);
      });
    } catch (error) {
      this.returnedValue = null;
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
}
