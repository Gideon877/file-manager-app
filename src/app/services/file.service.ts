import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { FileSystemEntry, DirectoryListingResponse } from '../models/file-system-entry.model';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    constructor(private apollo: Apollo) {
        console.log('🔧 FileService initialized');
    }

    getDirectoryListing(path?: string): Observable<FileSystemEntry[]> {
        console.log('📤 getDirectoryListing called with path:', path);

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
        console.log('📤 GraphQL Variables:', variables);

        return this.apollo
            .watchQuery<DirectoryListingResponse>({
                query,
                variables,
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(
                map((result) => {
                    console.log('📥 GraphQL Response:', result);
                    
                    if (result.error) {
                        console.error('❌ GraphQL Error:', result.error);
                        throw new Error(result.error.message);
                    }
                    
                    if (!result.data || !result.data.directoryListing) {
                        console.error('❌ No data in response:', result);
                        throw new Error('No data received from server');
                    }
                    
                    console.log('✅ Received entries:', result.data.directoryListing.length);
                    return result.data.directoryListing as FileSystemEntry[];
                }),
                catchError((error) => {
                    console.error('❌ Error in getDirectoryListing:', error);
                    
                    // Log network errors
                    if (error.networkError) {
                        console.error('🌐 Network Error:', error.networkError);
                    }
                    if (error.graphQLErrors) {
                        console.error('📊 GraphQL Errors:', error.graphQLErrors);
                    }
                    
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