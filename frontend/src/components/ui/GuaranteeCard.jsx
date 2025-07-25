import React from 'react';

const GuaranteeCard = ({ item }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div>
        <img src={item.imageUrl} alt={`${item.title} icon`} className="w-16 h-16" />
      </div>
      <span className="text-lg font-semibold">{item.title}</span>
      <span className="text-center text-secondary/70 w-[70%]">{item.description}</span>
    </div>
  );
};

export default GuaranteeCard;
