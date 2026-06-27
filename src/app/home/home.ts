import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent {
    // Signal for the current directory path
    protected currentPath = signal('/Users/username/Documents');

    // Signal for file count
    protected fileCount = signal(0);

    // Signal for folder count
    protected folderCount = signal(0);

    // Sample breadcrumb items
    protected breadcrumbs = signal([
        { name: 'Home', path: '/' },
        { name: 'Documents', path: '/documents' },
        { name: 'Projects', path: '/documents/projects' }
    ]);
}