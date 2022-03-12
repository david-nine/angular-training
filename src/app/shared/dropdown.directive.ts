import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appDropdown]',
})
export class DropdownDirective {

    @HostBinding('class.open') 
    isOpen = false;
 

    @HostListener('document:click', ['$event.target']) toggleOpen(target: string) {
        this.isOpen = this.elRef.nativeElement.contains(target) ? !this.isOpen : false;
    }

    constructor(private elRef: ElementRef) { }
}   