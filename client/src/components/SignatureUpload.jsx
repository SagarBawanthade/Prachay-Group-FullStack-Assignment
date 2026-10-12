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
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div
        className={`border-2 border-dashed rounded-xl p-4 transition text-center relative ${
          error ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/60'
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
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs max-w-xs w-full flex items-center justify-center min-h-[100px]">
              <img
                src={displayImage}
                alt="Signature preview"
                className="max-h-24 max-w-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium inline-flex items-center gap-1 transition"
              >
                <Edit3 className="w-3 h-3" /> Change Image
              </button>
              {signatureFile && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs px-2.5 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium inline-flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer py-4 flex flex-col items-center justify-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse signature image
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports PNG, JPG, or WEBP (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
    </div>
  );
};
