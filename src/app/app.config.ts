import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';

const APOLLO_URI = 'http://localhost:4006/graphql';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
    return {
        link: httpLink.create({ uri: APOLLO_URI }),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'network-only',
                errorPolicy: 'all',
            },
        },
    };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({
            eventCoalescing: true,
            runCoalescing: true
        }),
        provideRouter(routes),
        provideHttpClient(),
        Apollo,
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
};