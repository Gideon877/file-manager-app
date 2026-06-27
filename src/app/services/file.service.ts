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

        const variables = path ? { path } : {};

        return this.apollo
            .watchQuery<DirectoryListingResponse>({
                query,
                variables,
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(
                map((result) => {
                    if (result.error) {
                        throw new Error(result.error.message);
                    }
                    if (!result.data || !result.data.directoryListing) {
                        throw new Error('No data received from server');
                    }
                    return result.data.directoryListing;
                }),
                catchError((error) => {
                    console.error('Error in getDirectoryListing:', error);
                    return throwError(() => new Error(error.message || 'Failed to load directory contents'));
                })
            );
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
    }
}