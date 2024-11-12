import { useState } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number;
}

export default function FileUpload({ onFileSelect, accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png", maxSize = 5242880 }: FileUploadProps) {
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError('');

        if (file) {
            if (file.size > maxSize) {
                setError('O arquivo não pode ser maior que 5MB');
                return;
            }

            onFileSelect(file);
        }
    };

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Anexo
            </label>
            <input
                type="file"
                onChange={handleFileChange}
                accept={accept}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    dark:file:bg-blue-900/50 dark:file:text-blue-300
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900
                    file:cursor-pointer"
            />
            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
} 