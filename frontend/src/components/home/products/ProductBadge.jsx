const ProductBadge = ({ type, value, className = "" }) => {
    const badgeConfigs = {
      sale: {
        bg: 'bg-emerald-500',
        text: 'text-white',
        content: `${value}%`
      },
      outOfStock: {
        bg: 'bg-red-500',
        text: 'text-white',
        content: 'Out of Stock'
      },
      lowStock: {
        bg: 'bg-amber-500',
        text: 'text-white',
        content: 'Low Stock'
      },
      hot: {
        bg: 'bg-red-500',
        text: 'text-white',
        content: 'HOT'
      },
      new: {
        bg: 'bg-blue-500',
        text: 'text-white',
        content: 'NEW'
      }
    };
  
    const config = badgeConfigs[type];
    if (!config) return null;
  
    return (
      <div className={`
        absolute top-3 left-3 z-20
        ${config.bg} ${config.text}
        text-xs font-semibold
        px-2.5 py-1 rounded-md
        shadow-sm
        ${className}
      `}>
        {config.content}
      </div>
    );
  };

  export default ProductBadge;