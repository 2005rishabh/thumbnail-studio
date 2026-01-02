import { DownloadIcon, ImageIcon, Loader2Icon } from 'lucide-react';
import type { IThumbnail, AspectRatio } from '../../public/assets/assets';

const aspectMap: Record<AspectRatio, string> = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
};

const PreviewPanel = ({
    thumbnail,
    isLoading,
    aspectRatio,
}: {
    thumbnail: IThumbnail | null;
    isLoading: boolean;
    aspectRatio: AspectRatio;
}) => {
    const onDownload = () => {
        if (!thumbnail?.image_url) return;
        const link = document.createElement('a');
        link.href = thumbnail.image_url.replace('/upload', '/upload/fl_attachment');
        link.click();
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* CARD */}
            <div className="rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex flex-col">

                {/* IMAGE CONTAINER (FIXED HEIGHT) */}
                <div className="relative h-[260px] w-full overflow-hidden bg-black">
                    <div className={`absolute inset-0 ${aspectMap[aspectRatio]} mx-auto`}>
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
                                <Loader2Icon className="size-8 animate-spin text-zinc-400" />
                                <p className="text-xs text-zinc-400 mt-2">Generating…</p>
                            </div>
                        )}

                        {!isLoading && thumbnail?.image_url && (
                            <img
                                src={thumbnail.image_url}
                                alt={thumbnail.title}
                                className="h-full w-full object-contain"
                            />
                        )}

                        {!isLoading && !thumbnail?.image_url && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                                <ImageIcon className="size-10 opacity-50" />
                                <p className="text-xs mt-2">No preview</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col gap-3">
                    <p className="text-sm font-medium text-white line-clamp-2">
                        {thumbnail?.title || 'Untitled'}
                    </p>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={onDownload}
                            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition"
                        >
                            <DownloadIcon className="size-4" />
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
