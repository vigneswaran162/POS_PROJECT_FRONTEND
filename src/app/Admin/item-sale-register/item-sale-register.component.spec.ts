import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSaleRegisterComponent } from './item-sale-register.component';

describe('ItemSaleRegisterComponent', () => {
  let component: ItemSaleRegisterComponent;
  let fixture: ComponentFixture<ItemSaleRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSaleRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSaleRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
