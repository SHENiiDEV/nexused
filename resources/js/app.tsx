import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Suppress third-party browser extension noise (e.g. adblockers, password managers, web-vitals extensions)
if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason?.message || String(event.reason || '');
        if (
            reason.includes('No Listener') ||
            reason.includes('tabs:outgoing.message.ready') ||
            reason.includes('message channel closed') ||
            reason.includes('uBOL') ||
            reason.includes('reportAllChanges')
        ) {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    window.addEventListener('error', (event) => {
        const msg = event.message || '';
        const filename = event.filename || '';
        if (
            filename.includes('content.js') ||
            filename.includes('css-generic.js') ||
            msg.includes('No Listener') ||
            msg.includes('uBOL') ||
            (msg.includes('startTime') && (!filename || filename.includes('VM')))
        ) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
}

const appName = import.meta.env.VITE_APP_NAME || 'NexusEd';

createInertiaApp({
    title: (title) => (title ? `${title} | ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#10b981',
        showSpinner: true,
    },
});
