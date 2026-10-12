import React, { useRef, useState } from 'react';
import { Upload, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';

export const SignatureUpload = ({
  label = 'Signature (Required)',
  signatureFile,
  setSignatureFile,
  existingUrl = null,
  required = false,
  error = '',
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setSignatureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setSignatureFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || existingUrl;

  return (
    <div className="text-left">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div
        className={`border-2 border-dashed rounded-xl p-4 transition-all text-center relative ${
          error
            ? 'border-rose-400 bg-rose-50/20 dark:bg-rose-950/20'
            : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-slate-100/60 dark:hover:bg-slate-900/80'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />

        {displayImage ? (
          <div className="flex flex-col items-center gap-2.5">
            {/* Signature preview container with deep dark mode styling */}
            <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs max-w-xs w-full flex items-center justify-center min-h-[110px]">
              <img
                src={displayImage}
                alt="Signature preview"
                className="max-h-24 max-w-full object-contain dark:invert print:invert-0"
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Change Image
              </button>
              {signatureFile && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-semibold inline-flex items-center gap-1.5 transition cursor-pointer border border-rose-200 dark:border-rose-900"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer py-5 flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Click to browse signature image
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                PNG, JPG, or WEBP (Transparent or solid background)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
    </div>
  );
};
