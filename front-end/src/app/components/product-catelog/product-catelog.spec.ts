import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatelog } from './product-catelog';

describe('ProductCatelog', () => {
  let component: ProductCatelog;
  let fixture: ComponentFixture<ProductCatelog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCatelog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCatelog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
