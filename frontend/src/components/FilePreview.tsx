import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface FilePreviewProps {
    fileUrl: string;
    onClose: () => void;
}

export default function FilePreview({ fileUrl, onClose }: FilePreviewProps) {
    const [imageError, setImageError] = useState(false);
    const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif)$/i);
    const fileName = fileUrl.split('/').pop();

    // Remove qualquer prefixo http://localhost:8000 existente
    const cleanUrl = fileUrl.replace('http://localhost:8000', '');
    const fullUrl = `http://localhost:8000${cleanUrl}`;

    useEffect(() => {
        console.log('URL da imagem:', fullUrl);
    }, [fullUrl]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-800/95 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {fileName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-4 flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 h-[70vh]">
                    {isImage ? (
                        imageError ? (
                            <div className="text-red-500 dark:text-red-400">
                                Erro ao carregar a imagem
                            </div>
                        ) : (
                            <img
                                src={fullUrl}
                                alt={fileName}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    console.error('Erro ao carregar imagem:', e);
                                    setImageError(true);
                                }}
                            />
                        )
                    ) : (
                        <iframe
                            src={fullUrl}
                            className="w-full h-full"
                            title={fileName}
                        />
                    )}
                </div>
            </div>
        </div>
    );
} 