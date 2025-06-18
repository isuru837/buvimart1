import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeftMenu } from './admin-left-menu';

describe('AdminLeftMenu', () => {
  let component: AdminLeftMenu;
  let fixture: ComponentFixture<AdminLeftMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeftMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLeftMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
