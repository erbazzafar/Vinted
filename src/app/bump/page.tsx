import React, { Suspense } from 'react';
import BumpCheckOut from '../components/bumpCheckOut';

function BumpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BumpCheckOut />
        </Suspense>
    );
}

export default BumpPage;