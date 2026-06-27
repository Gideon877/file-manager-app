import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { FileSystemEntry, DirectoryListingResponse } from '../models/file-system-entry.model';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    constructor(private apollo: Apollo) { }

    /**
     * Get directory listing using GraphQL query
     */
    getDirectoryListing(path?: string): Observable<FileSystemEntry[]> {
        const query = gql`
            query GetDirectoryListing($path: String) {
                directoryListing(path: $path) {
                    name
                    path
                    size
                    extension
                    createdAt
                    modifiedAt
                    accessedAt
                    permissions
                    isDirectory
                    childCount
                    mimeType
                    hash
                    symlinkTarget
                    canRead
                    canWrite
                    canExecute
                    owner
                    group
                    uid
                    gid
                }
            }
        `;

        return this.apollo
            .watchQuery<DirectoryListingResponse>({
                query,
                variables: { path },
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(
                map((result) => {
                    // Handle errors from Apollo
                    if (result.error) {
                        throw new Error(result.error.message);
                    }
                    // Check if data exists
                    if (!result.data || !result.data.directoryListing) {
                        throw new Error('No data received from server');
                    }
                    return result.data.directoryListing;
                }),
                catchError((error) => {
                    console.error('Error fetching directory listing:', error);
                    return throwError(() => new Error(error.message || 'Failed to load directory contents'));
                })
            );
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
    }
}