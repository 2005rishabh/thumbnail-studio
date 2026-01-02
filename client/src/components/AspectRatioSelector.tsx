import { RectangleHorizontal, RectangleVertical, Square } from 'lucide-react';
import { aspectRatios, type AspectRatio } from '../../public/assets/assets';
import type React from 'react';

const AspectRatioSelector = ({ value, onChange }: { value: AspectRatio; onChange: (val: AspectRatio) => void }) => {

    const iconMap = {
        '16:9': <RectangleHorizontal className='size-6' />,
        '1:1': <Square className='size-6' />,
        '9:16': <RectangleVertical className='size-6' />,
    } as Record<AspectRatio, React.ReactNode>;

    return ( 
        <div className='space-y-3 dark'>
            <label className='block text-sm font-medium text-zinc-200'>Aspect Ratio</label>

            <div className='flex flex-wrap gap-2'>
                {aspectRatios.map((ratio) => (
                    <button
                        key={ratio}
                        onClick={() => onChange(ratio)}
                        className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${value === ratio
                            ? 'bg-pink-500/10 border-pink-500 text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.1)]'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        {iconMap[ratio]}
                        <span className='text-sm font-medium'>{ratio}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AspectRatioSelector;