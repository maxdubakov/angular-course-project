import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open') expanded = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.expanded = this.elementRef.nativeElement.contains(event.target) ? !this.expanded : false;
  }

  constructor(private elementRef: ElementRef) { }

}
