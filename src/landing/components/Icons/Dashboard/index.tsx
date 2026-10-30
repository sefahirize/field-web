import React from 'react';

interface Props {
    className?: string;
}

const Dashboard: React.FC<Props> = ({ className }) => {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M0.75 0.75H23.25V23.25H0.75V0.75ZM3.25 10.75V20.75H10.75V10.75H3.25ZM10.75 8.25H3.25V3.25H10.75V8.25ZM13.25 3.25V13.25H20.75V3.25H13.25ZM20.75 15.75H13.25V20.75H20.75V15.75Z" />
        </svg>
    );
};

export default Dashboard;
