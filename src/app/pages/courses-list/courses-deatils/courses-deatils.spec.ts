import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesDeatils } from './courses-deatils';

describe('CoursesDeatils', () => {
  let component: CoursesDeatils;
  let fixture: ComponentFixture<CoursesDeatils>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesDeatils]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesDeatils);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
