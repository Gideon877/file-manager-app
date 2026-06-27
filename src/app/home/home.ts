import { Component, signal, inject, OnInit, computed, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../services/file.service';
import { FileSystemEntry } from '../models/file-system-entry.model';
import { FilePreviewComponent } from '../file-preview/file-preview';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FilePreviewComponent],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
    private fileService = inject(FileService);

    // View child reference to the preview modal
    protected previewModal = viewChild(FilePreviewComponent);

    // Signals for reactive state
    protected currentPath = signal<string>('');
    protected files = signal<FileSystemEntry[]>([]);
    protected filteredFiles = signal<FileSystemEntry[]>([]);
    protected loading = signal<boolean>(true);
    protected error = signal<string | null>(null);
    protected searchTerm = signal('');
    protected viewMode = signal<'grid' | 'list'>('list');

    // Computed stats
    protected fileCount = computed(() => 
        this.files().filter(f => !f.isDirectory).length
    );
    protected folderCount = computed(() => 
        this.files().filter(f => f.isDirectory).length
    );
    protected totalSize = computed(() => 
        this.files().reduce((sum, f) => sum + (f.isDirectory ? 0 : f.size), 0)
    );

    // Breadcrumbs
    protected breadcrumbs = signal<{ name: string; path: string }[]>([
        { name: 'Root', path: '' }
    ]);

    ngOnInit() {
        this.currentPath.set('');
        this.loadDirectory('');
    }

    /**
     * Load directory listing
     */
    loadDirectory(path: string) {
        this.loading.set(true);
        this.error.set(null);

        this.fileService
            .getDirectoryListing(path)
            .pipe(
                catchError((err) => {
                    console.error('Error in loadDirectory:', err);
                    this.error.set(err.message || 'Failed to load directory');
                    this.loading.set(false);
                    return of([]);
                })
            )
            .subscribe({
                next: (entries) => {
                    this.files.set(entries);
                    this.filterFiles();
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err.message || 'An unexpected error occurred');
                    this.loading.set(false);
                }
            });
    }

    /**
     * Open file preview modal or navigate to directory
     */
    openPreview(file: FileSystemEntry) {
        if (!file.isDirectory) {
            this.previewModal()?.open(file);
        } else {
            this.navigateToDirectory(file);
        }
    }

    /**
     * Navigate to a directory
     */
    navigateToDirectory(entry: FileSystemEntry) {
        if (entry.isDirectory) {
            this.currentPath.set(entry.path);
            
            this.breadcrumbs.update(crumbs => {
                const newCrumbs = [...crumbs];
                const existingIndex = newCrumbs.findIndex(c => c.path === entry.path);
                if (existingIndex !== -1) {
                    newCrumbs.splice(existingIndex + 1);
                } else {
                    newCrumbs.push({ name: entry.name, path: entry.path });
                }
                return newCrumbs;
            });

            this.loadDirectory(entry.path);
        }
    }

    /**
     * Navigate to a breadcrumb path
     */
    navigateToBreadcrumb(path: string, index: number) {
        this.breadcrumbs.update(crumbs => {
            crumbs.splice(index + 1);
            return [...crumbs];
        });
        this.currentPath.set(path);
        this.loadDirectory(path);
    }

    /**
     * Go up one directory level
     */
    goUp() {
        const currentPath = this.currentPath();
        if (currentPath) {
            const parentPath = currentPath.split('/').slice(0, -1).join('/');
            this.currentPath.set(parentPath || '');
            
            this.breadcrumbs.update(crumbs => {
                crumbs.splice(-1);
                return [...crumbs];
            });
            
            this.loadDirectory(parentPath || '');
        }
    }

    /**
     * Filter files based on search term
     */
    filterFiles() {
        const search = this.searchTerm().toLowerCase().trim();
        if (!search) {
            this.filteredFiles.set(this.files());
            return;
        }
        
        this.filteredFiles.set(
            this.files().filter(file => 
                file.name.toLowerCase().includes(search)
            )
        );
    }

    /**
     * Toggle view mode
     */
    toggleView(mode: 'grid' | 'list') {
        this.viewMode.set(mode);
    }

    /**
     * Get icon for file type
     */
    getFileIcon(entry: FileSystemEntry): string {
        if (entry.isDirectory) return '📁';
        
        const iconMap: Record<string, string> = {
            'js': '📄',
            'ts': '📘',
            'json': '📋',
            'html': '🌐',
            'css': '🎨',
            'md': '📝',
            'txt': '📃',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'svg': '🖼️',
            'webp': '🖼️',
            'pdf': '📕',
            'doc': '📄',
            'docx': '📄',
            'xls': '📊',
            'xlsx': '📊',
            'zip': '📦',
            'tar': '📦',
            'gz': '📦',
            'lock': '🔒',
            'mp3': '🎵',
            'wav': '🎵',
            'ogg': '🎵',
            'mp4': '🎬',
            'webm': '🎬',
            'avi': '🎬',
            'mov': '🎬'
        };
        
        const ext = entry.extension || '';
        return iconMap[ext] || '📄';
    }

    /**
     * Get color for file type
     */
    getFileColor(entry: FileSystemEntry): string {
        if (entry.isDirectory) return '#6B46C1';
        
        const colorMap: Record<string, string> = {
            'js': '#F7DF1E',
            'ts': '#3178C6',
            'json': '#5A9BDB',
            'html': '#E34F26',
            'css': '#1572B6',
            'md': '#083FA1',
            'txt': '#718096',
            'jpg': '#FF6B6B',
            'jpeg': '#FF6B6B',
            'png': '#FF6B6B',
            'gif': '#FF6B6B',
            'svg': '#FF6B6B',
            'webp': '#FF6B6B',
            'pdf': '#E53E3E',
            'lock': '#2D3748',
            'mp3': '#48BB78',
            'wav': '#48BB78',
            'ogg': '#48BB78',
            'mp4': '#9F7AEA',
            'webm': '#9F7AEA',
            'avi': '#9F7AEA',
            'mov': '#9F7AEA'
        };
        
        const ext = entry.extension || '';
        return colorMap[ext] || '#718096';
    }

    /**
     * Format file size
     */
    formatFileSize(bytes: number): string {
        return this.fileService.formatFileSize(bytes);
    }
}