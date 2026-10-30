interface PlusIconProps {
  className?: string;
}

const PlusIcon = ({ className = "app-blue" }: PlusIconProps) => {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.58333 0.75V5.41667H11.25V6.58333H6.58333V11.25H5.41667V6.58333H0.75V5.41667H5.41667V0.75H6.58333Z" 
        fill="currentColor"
      />
    </svg>
  );
};

export default PlusIcon;
