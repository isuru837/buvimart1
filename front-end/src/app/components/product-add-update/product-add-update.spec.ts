import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddUpdate } from './product-add-update';

describe('ProductAddUpdate', () => {
  let component: ProductAddUpdate;
  let fixture: ComponentFixture<ProductAddUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAddUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAddUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
