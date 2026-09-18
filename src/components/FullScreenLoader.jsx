import React from 'react';
import { createPortal } from 'react-dom';
import LoadingAnimation from './LoadingAnimation';

const FullScreenLoader = ({ text }) => {
    return createPortal(
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[99999] flex items-center justify-center">
            <LoadingAnimation size="large" text={text || 'Memproses...'} />
        </div>,
        document.body
    );
};

export default FullScreenLoader;
