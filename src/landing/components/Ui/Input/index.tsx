interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rounded?: boolean;
  className?: string;
}

const Input = ({
  label,
  error,
  icon,
  rounded = false,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full px-4 py-2 
            ${icon ? 'pl-10' : ''} 
            ${rounded ? 'rounded-full' : 'rounded-md'}
            bg-white
            text-gray-700
            placeholder:text-gray-400
            shadow-[0px_0px_0px_1px_rgba(9,25,72,0.13),0px_1px_2px_0px_rgba(18,55,105,0.08)]
            hover:bg-gray-50
            focus:outline-hidden focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-transparent'}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;