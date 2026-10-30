import React from 'react';

interface Props {
    className?: string;
}

const JobText: React.FC<Props> = ({ className }) => {
    return (
        <svg className={className} width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M0 0.5H11.7678L20 8.73223V25.5H0V0.5ZM2.5 3V23H17.5V10.5H10V3H2.5ZM12.5 4.76777L15.7322 8H12.5V4.76777ZM5 13H11.25V15.5H5V13ZM5 18H15.625V20.5H5V18Z" />
        </svg>
    );
};

export default JobText;

