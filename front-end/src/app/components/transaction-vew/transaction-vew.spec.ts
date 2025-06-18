import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionVew } from './transaction-vew';

describe('TransactionVew', () => {
  let component: TransactionVew;
  let fixture: ComponentFixture<TransactionVew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionVew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionVew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
