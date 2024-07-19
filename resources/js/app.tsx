import './bootstrap';


import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './Providers/ThemeProvider';
import { Toaster } from './Components/ui/sonner';
import QueryProvider from './Providers/QueryProvider';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => require(`./Pages/${name}`),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <QueryProvider>
                    <App {...props} />
                </QueryProvider>
                <Toaster richColors theme='dark' duration={2345} closeButton position='top-center'  />
            </ThemeProvider>
        );
    },
});

InertiaProgress.init({ color: '#4B5563',delay: 25});
