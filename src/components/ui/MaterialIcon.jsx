
export default function MaterialIcon({
  name,
  className = '',
  size = 'md',
  color = '',
  ...props
}) {
  const sizes = {
    xs: 'text-[12px]',
    sm: 'text-[14px]',
    md: 'text-[16px]',
    lg: 'text-[18px]',
    xl: 'text-[20px]',
    '2xl': 'text-[24px]',
    '3xl': 'text-[30px]',
  };

  const sizeClass = sizes[size] || '';
  const combinedClasses = `material-symbols-outlined ${sizeClass} ${color} ${className}`;

  return (
    <span className={combinedClasses} {...props}>
      {name}
    </span>
  );
}