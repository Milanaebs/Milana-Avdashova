import React, { useEffect } from 'react';
import { X, Download, ExternalLink, Printer } from 'lucide-react';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose, pdfUrl }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-4xl h-[90vh] bg-[#FDFBF7] border border-[#EAE4D9] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4D9] bg-[#F9F6F0]">
          <div>
            <h3 id="modal-title" className="font-serif text-xl font-medium text-[#1C1917]">
              Curriculum Vitae — Milana Avdashova
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Original Verified English Version (2026) · Tallinn, Estonia
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download="Milana_Avdashova_CV_2026.pdf"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#FDFBF7] border border-[#D6CFC3] hover:bg-[#EFEAE1] transition-colors rounded-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#FDFBF7] border border-[#D6CFC3] hover:bg-[#EFEAE1] transition-colors rounded-sm"
              title="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </a>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE4D9]/50 rounded-sm transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 w-full bg-[#EFEAE1]/50 p-2 sm:p-4 overflow-hidden">
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            title="Milana Avdashova Curriculum Vitae"
            className="w-full h-full border border-[#D6CFC3] rounded-sm bg-white shadow-inner"
          />
        </div>
      </div>
    </div>
  );
};
