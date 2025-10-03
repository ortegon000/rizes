import React from 'react';

interface KeepScrolling {
    id?: string;
    className?: string;
}

export const KeepScrolling: React.FC<KeepScrolling> = ({ className = "", id = "keep-scrolling" }) => {

    return (
        <svg
            id={id}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="14"
            fill="none"
            aria-hidden="true"
            opacity="1"
            style={{ translate: "none", rotate: "none", scale: "none" }}
            viewBox="0 0 34 14"
            visibility="inherit"
        >
            <path
            fill="currentColor"
            fillRule="evenodd"
            d="M33.56 1.543c.478 1.045.128 2.335-.78 2.883l-15.741 9.492L1.487 4.421C.58 3.868.236 2.575.717 1.534 1.2.492 2.326.097 3.233.65L17.05 9.089 31.05.646c.909-.549 2.033-.147 2.51.897"
            clipRule="evenodd"
            ></path>
        </svg>
    );
};