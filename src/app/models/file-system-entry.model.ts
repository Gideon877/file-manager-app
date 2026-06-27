export interface FileSystemEntry {
    name: string;
    path: string;
    size: number;
    extension: string | null;
    createdAt: string;
    modifiedAt: string;
    accessedAt: string | null;
    permissions: string;
    isDirectory: boolean;
    childCount: number | null;
    mimeType: string | null;
    hash: string | null;
    symlinkTarget: string | null;
    canRead: boolean;
    canWrite: boolean;
    canExecute: boolean;
    owner: string | null;
    group: string | null;
    uid: number | null;
    gid: number | null;
}

export interface DirectoryListingResponse {
    directoryListing: FileSystemEntry[];
}