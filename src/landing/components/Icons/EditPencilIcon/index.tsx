interface EditPencilIconProps {
    className?: string;
}

const EditPencilIcon = ({ className = "" }: EditPencilIconProps) => {
    return (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M17.8963 18.5718H1.94969V2.52161H11.3727V1.0625H0.5V20.0309H19.346V9.08758H17.8963V18.5718Z" fill="currentColor" />
            <path d="M6.48592 9.49391L5.82812 14.7999L11.0999 14.1368L17.9584 7.2323L20.5004 4.67412L15.8875 0.03125L14.0935 1.83653L6.48592 9.49391ZM10.4255 12.751L7.49527 13.1194L7.86095 10.1717L14.0935 3.90007L16.6562 6.4794L10.4255 12.751ZM15.8875 2.09442L18.4502 4.67412L17.6812 5.44818L15.1185 2.86848L15.8875 2.09442Z" fill="currentColor" />
        </svg>
    );
};

export default EditPencilIcon;