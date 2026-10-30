import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the wedding invitation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Renolin');
    expect(compiled.querySelector('#letter-title')?.textContent).toContain('this day is whole');
    expect(compiled.querySelector('.letter-signoff')?.textContent).toContain('Renolin & Evanchelin');
    expect(compiled.querySelector('.visitor-list')).toBeNull();
    expect(compiled.querySelector('.travel-note strong')?.textContent).toContain('Before the first hymn');
  });
});
