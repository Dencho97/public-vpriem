import React from 'react';

import ErrorBoundary from './components/ErrorBoundary';
import routers from './routers';

const App = () => (
    <ErrorBoundary>
        {routers}
    </ErrorBoundary>
);

export default App;
