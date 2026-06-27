import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilePreviewComponent } from './file-preview';

@NgModule({
    imports: [CommonModule, FilePreviewComponent],
    exports: [FilePreviewComponent]
})
export class FilePreviewModule { }