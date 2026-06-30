import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        MatGridListModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatTooltipModule,
        MatBadgeModule,
        MatDividerModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatFormFieldModule
    ],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        MatGridListModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatTooltipModule,
        MatBadgeModule,
        MatDividerModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatDialogModule
    ]
})
export class MaterialModule { }