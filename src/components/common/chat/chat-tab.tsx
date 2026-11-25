import { cn } from '@/lib/utils/utils';
import { useState } from 'react';
import { motion } from 'motion/react';
export const ChatTabs = () => {
  const [selected, setSelected] = useState('all');
  const options = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'un_read' },
    { label: 'Personal', value: 'personal' },
  ];
  return (
    <div className="text-muted font-semibold grid grid-cols-3 px-1 gap-3 justify-between border border-border/10 py-1 rounded-full">
      {options.map((i) => {
        const isSelected = selected === i.value;
        return (
          <div
            key={i.value}
            onClick={() => setSelected(i.value)}
            className={cn(
              'relative text-center rounded-full py-1.5 cursor-pointer transition-colors duration-200',
              isSelected ? 'text-primary-text' : '',
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full bg-primary-900/30"
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 25,
                }}
              />
            )}
            <span>{i.label}</span>
          </div>
        );
      })}
    </div>
  );
};
