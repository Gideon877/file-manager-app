import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSystemEntry } from '../models/file-system-entry.model';

@Component({
    selector: 'app-file-preview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './file-preview.html',
    styleUrl: './file-preview.css'
})
export class FilePreviewComponent {
    protected file = signal<FileSystemEntry | null>(null);
    protected isOpen = signal(false);

    // Computed properties for file type detection
    protected isImage = computed(() => {
        const file = this.file();
        if (!file || file.isDirectory) return false;
        const ext = file.extension?.toLowerCase() || '';
        return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext);
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

    open(file: FileSystemEntry) {
        this.file.set(file);
        this.isOpen.set(true);
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen.set(false);
        document.body.style.overflow = '';
        setTimeout(() => {
            this.file.set(null);
        }, 300);
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    }

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

    protected getFileUrl(file: FileSystemEntry): string {
        if (!file) return '';
        return `http://localhost:3000/file/${encodeURIComponent(file.path)}`;
    }
}