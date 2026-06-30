import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileSystemEntry } from '../models/file-system-entry.model';

@Component({
    selector: 'app-file-preview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './file-preview.html',
    styleUrl: './file-preview.css'
})
export class FilePreviewComponent {
    private sanitizer = inject(DomSanitizer);
    private readonly API_BASE_URL = 'http://localhost:4006';

    protected file = signal<FileSystemEntry | null>(null);
    protected isOpen = signal(false);
    protected imageError = signal(false);
    protected loading = signal(true);

    // ===== FILE TYPE DETECTION =====
    protected isImage = computed(() => {
        const file = this.file();
        if (!file || file.isDirectory) return false;
        const ext = file.extension?.toLowerCase() || '';
        return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'heic'].includes(ext);
    });

    protected isPDF = computed(() => {
        const file = this.file();
        if (!file || file.isDirectory) return false;
        return file.extension?.toLowerCase() === 'pdf';
    });

    protected isAudio = computed(() => {
        const file = this.file();
        if (!file || file.isDirectory) return false;
        const ext = file.extension?.toLowerCase() || '';
        return ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(ext);
    });

    protected isVideo = computed(() => {
        const file = this.file();
        if (!file || file.isDirectory) return false;
        const ext = file.extension?.toLowerCase() || '';
        return ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv'].includes(ext);
    });

    protected isText = computed(() => {
        const file = this.file();
        if (!file || file.isDirectory) return false;
        const ext = file.extension?.toLowerCase() || '';
        return ['txt', 'js', 'ts', 'html', 'css', 'json', 'xml', 'md', 'yaml', 'yml', 'log'].includes(ext);
    });

    // ===== FORMATTED VALUES =====
    protected fileSizeFormatted = computed(() => {
        const file = this.file();
        if (!file) return '0 B';
        return this.formatFileSize(file.size);
    });

    protected fileDateFormatted = computed(() => {
        const file = this.file();
        if (!file) return '';
        return new Date(file.modifiedAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    });

    protected fileCreatedFormatted = computed(() => {
        const file = this.file();
        if (!file) return '';
        return new Date(file.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    });

    // ===== SAFE URLs =====
    protected safeFileUrl = computed(() => {
        const file = this.file();
        if (!file) return null;
        const encodedPath = file.path.split('/')
            .map(part => encodeURIComponent(part))
            .join('/');
        const url = `${this.API_BASE_URL}/file/${encodedPath}`;
        console.log('🔗 File URL:', url);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });

    protected safeImageUrl = computed(() => {
        const file = this.file();
        if (!file) return null;
        // Simple approach: replace spaces with %20
        const encodedPath = file.path.replace(/ /g, '%20');
        const url = `${this.API_BASE_URL}/file/${encodedPath}`;
        console.log('🖼️ Image URL:', url);
        return this.sanitizer.bypassSecurityTrustUrl(url);
    });

    // ===== PUBLIC METHODS =====
    open(file: FileSystemEntry) {
        console.log('📂 Opening file preview for:', file.name);
        this.file.set(file);
        this.isOpen.set(true);
        this.imageError.set(false);
        this.loading.set(true);
        document.body.style.overflow = 'hidden';

        // Fallback: if image doesn't load in 5 seconds, show error
        setTimeout(() => {
            if (this.loading()) {
                console.log('⏰ Image load timeout');
                this.loading.set(false);
                this.imageError.set(true);
            }
        }, 5000);
    }

    close() {
        this.isOpen.set(false);
        document.body.style.overflow = '';
        setTimeout(() => {
            this.file.set(null);
            this.imageError.set(false);
            this.loading.set(true);
        }, 300);
    }

    retryImage() {
        console.log('🔄 Retrying image load');
        this.imageError.set(false);
        this.loading.set(true);
        // Force a reload by updating the file reference
        const currentFile = this.file();
        if (currentFile) {
            this.file.set(null);
            setTimeout(() => {
                this.file.set(currentFile);
                // Don't set loading to false here - let the image load event do it
            }, 100);
        }
    }

    onImageLoad() {
        console.log('✅ Image loaded successfully');
        this.loading.set(false);
        this.imageError.set(false);
    }

    onImageError() {
        console.log('❌ Image failed to load');
        this.loading.set(false);
        this.imageError.set(true);
    }

    // ===== HELPER METHODS =====
    getMimeType(file: FileSystemEntry): string {
        if (!file || file.isDirectory) return '';
        const ext = file.extension?.toLowerCase() || '';
        const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'webp': 'image/webp',
            'bmp': 'image/bmp',
            'ico': 'image/x-icon',
            'heic': 'image/heic',
            'pdf': 'application/pdf',
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'ogg': 'audio/ogg',
            'flac': 'audio/flac',
            'm4a': 'audio/mp4',
            'aac': 'audio/aac',
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'avi': 'video/x-msvideo',
            'mov': 'video/quicktime',
            'mkv': 'video/x-matroska',
            'flv': 'video/x-flv',
            'wmv': 'video/x-ms-wmv',
            'txt': 'text/plain',
            'js': 'text/javascript',
            'ts': 'text/typescript',
            'html': 'text/html',
            'css': 'text/css',
            'json': 'application/json',
            'xml': 'application/xml',
            'md': 'text/markdown',
            'yaml': 'text/yaml',
            'yml': 'text/yaml',
            'log': 'text/plain'
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }

    getFileIcon(file: FileSystemEntry): string {
        if (!file) return '📄';
        if (file.isDirectory) return '📁';
        if (this.isImage()) return '🖼️';
        if (this.isPDF()) return '📕';
        if (this.isAudio()) return '🎵';
        if (this.isVideo()) return '🎬';
        if (this.isText()) return '📄';
        return '📄';
    }

    getFileTypeLabel(file: FileSystemEntry): string {
        if (!file) return 'Unknown';
        if (file.isDirectory) return 'Directory';
        if (this.isImage()) return 'Image';
        if (this.isPDF()) return 'PDF Document';
        if (this.isAudio()) return 'Audio File';
        if (this.isVideo()) return 'Video File';
        if (this.isText()) return 'Text File';
        return 'File';
    }

    getPermissionsLabel(file: FileSystemEntry): string {
        if (!file) return 'N/A';
        const perms = file.permissions || '---------';
        const parts = [
            perms.substring(0, 3) || '---',
            perms.substring(3, 6) || '---',
            perms.substring(6, 9) || '---'
        ];
        return `${parts[0]} ${parts[1]} ${parts[2]}`;
    }

    // ===== PRIVATE METHODS =====
    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    }
}