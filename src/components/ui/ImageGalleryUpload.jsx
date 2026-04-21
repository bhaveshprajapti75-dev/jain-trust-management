import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Plus, Camera, X, UploadCloud } from 'lucide-react';

const ImageGalleryUpload = ({ 
  images = [], 
  onAdd, 
  onRemove, 
  onImageClick,
  maxImages = 8, 
  disabled = false,
  title = "Gallery" 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    if (filesArray.length > 0) {
      onAdd(filesArray);
    }
    setShowMenu(false);
    // Reset inputs so the same file can be selected again
    if (galleryRef.current) galleryRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    try {
      return URL.createObjectURL(image);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Title Header */}
      <div className="flex items-center justify-between px-1">
        <label className="text-[13px] font-bold text-slate-700">{title}</label>
      </div>

      {/* Hidden File Inputs */}
      <input type="file" ref={galleryRef} multiple accept="image/*" className="hidden" onChange={handleFileChange} />
      <input type="file" ref={cameraRef} accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

      {images.length === 0 ? (
        /* Empty State - Browse Image */
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowMenu(!showMenu)}
            className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all
              ${disabled 
                ? 'border-slate-200 bg-slate-50 cursor-not-allowed text-slate-300' 
                : 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-600 group shadow-sm'
              }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
              ${disabled ? 'bg-slate-100' : 'bg-emerald-100 group-hover:scale-110'}`}>
              <UploadCloud size={18} className={disabled ? 'text-slate-300' : 'text-emerald-600'} />
            </div>
            <div className="text-center">
              <span className="block text-[13px] font-bold text-slate-700 leading-tight">Browse Image</span>
              <span className="text-[10px] text-slate-400 font-medium">JPG, PNG supported</span>
            </div>
          </button>

          {/* Centered Dropdown for Empty State */}
          {showMenu && (
            <UploadMenu 
              onGallery={() => galleryRef.current.click()} 
              onCamera={() => cameraRef.current.click()} 
              positionClass="top-full left-1/2 -translate-x-1/2 mt-2 origin-top"
            />
          )}
        </div>
      ) : (
        /* Gallery State */
        <div className="space-y-3">
          
          {/* Main Large Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group shadow-sm">
            <img 
              src={getImageUrl(images[0])} 
              alt="Primary" 
              className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
              onClick={() => onImageClick && onImageClick(images[0])}
            />
            {!disabled && (
              <button 
                type="button"
                onClick={() => onRemove(0)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
               <span className="text-[10px] font-bold text-white uppercase tracking-wider px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg">Primary Image</span>
            </div>
          </div>

            {/* Thumbnails Grid with the '+' Button */}
          <div className="grid grid-cols-4 gap-2">
            
            {/* Map through thumbnails */}
            {images.slice(1).map((image, idx) => (
              <div key={idx + 1} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                <img 
                  src={getImageUrl(image)} 
                  alt={`Thumbnail ${idx + 2}`} 
                  className="w-full h-full object-cover cursor-zoom-in hover:opacity-80 transition-opacity"
                  onClick={() => onImageClick && onImageClick(image)}
                />
                {!disabled && (
                  <button 
                    type="button"
                    onClick={() => onRemove(idx + 1)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            ))}

            {/* The '+' Upload Button Slot - Positioned in the right corner */}
            {!disabled && images.length < maxImages && (
              <div 
                className={`relative ${images.length < 4 ? 'col-start-4' : ''}`} 
                ref={menuRef}
              >
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-full aspect-square rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-95 shadow-sm"
                >
                  <Plus size={24} strokeWidth={2.5} />
                </button>

                {/* Right-aligned Dropdown for the grid button */}
                {showMenu && (
                  <UploadMenu 
                    onGallery={() => galleryRef.current.click()} 
                    onCamera={() => cameraRef.current.click()} 
                    positionClass="top-full right-0 mt-2 origin-top-right" 
                  />
                )}
              </div>
            )}

          </div>
          
          <p className="text-[10px] text-slate-400 font-medium text-center italic">
            * Max {maxImages} photos. First image is primary.
          </p>
        </div>
      )}
    </div>
  );
};

/* Reusable Dropdown Menu Sub-component */
const UploadMenu = ({ onGallery, onCamera, positionClass }) => (
  <div className={`absolute z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[200px] animate-in fade-in zoom-in-95 duration-200 ${positionClass}`}>
    <button 
      type="button"
      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/50 group transition-all"
      onClick={onGallery}
    >
      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
        <ImageIcon size={20} />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[13px] font-bold text-slate-700">Gallery</span>
        <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Upload from device</span>
      </div>
    </button>
    <button 
      type="button"
      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/50 group transition-all"
      onClick={onCamera}
    >
      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
        <Camera size={20} />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-[13px] font-bold text-slate-700">Camera</span>
        <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Take a photo</span>
      </div>
    </button>
  </div>
);

export default ImageGalleryUpload;