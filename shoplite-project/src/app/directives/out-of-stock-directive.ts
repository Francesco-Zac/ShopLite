import { Directive, ElementRef, input, OnInit,} from '@angular/core';

@Directive({
  selector: '[appOutOfStock]',
  standalone: true
})
export class OutOfStockDirective implements OnInit {

 appOutOfStock = input.required<number>();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.appOutOfStock() === 0) {
      const host = this.el.nativeElement as HTMLElement;
      host.style.opacity = '0.6';

      const btn = host.querySelector<HTMLButtonElement>('[data-buy-btn]');
      if (btn) {
        btn.disabled = true;
      }
    }
  }
}
