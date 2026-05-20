import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PimpBlogDescriptionComponent } from './pimp-blog-description.component';

describe('PimpBlogDescriptionComponent', () => {
  let component: PimpBlogDescriptionComponent;
  let fixture: ComponentFixture<PimpBlogDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PimpBlogDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PimpBlogDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
