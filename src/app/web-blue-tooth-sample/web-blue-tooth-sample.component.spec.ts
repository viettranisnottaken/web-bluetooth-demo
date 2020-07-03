import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebBlueToothSampleComponent } from './web-blue-tooth-sample.component';

describe('WebBlueToothSampleComponent', () => {
  let component: WebBlueToothSampleComponent;
  let fixture: ComponentFixture<WebBlueToothSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebBlueToothSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebBlueToothSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
