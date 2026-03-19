import { Directive, ElementRef, input, OnInit } from '@angular/core';

@Directive({
  selector: '[appOutOfStock]',
  standalone: true
})
export class OutOfStockDirective implements OnInit {
  appOutOfStock = input.required<number>();

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    if (this.appOutOfStock() <= 0) {
      host.style.opacity = '0.6';
      host.style.cursor = 'not-allowed';

      if (host instanceof HTMLButtonElement) {
        host.disabled = true;
        host.setAttribute('aria-disabled', 'true');
        return;
      }

      const btn = host.querySelector<HTMLButtonElement>('[data-buy-btn]');
      if (btn) {
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
      }
    }
  }
}
