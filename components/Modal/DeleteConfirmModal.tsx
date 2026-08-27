import { Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  itemType?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  confirmButtonColor?: string;
  confirmButtonHoverColor?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  itemName = "this item",
  itemType = "item",
  message,
  confirmText = "Delete",
  cancelText = "deleteModal.cancel",
  isLoading = false,
  icon,
  confirmButtonColor = "bg-red-600",
  confirmButtonHoverColor = "hover:bg-red-700",
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;
  const { t } = useTranslation();

  const defaultMessage = t("deleteModal.messageWithName", {
    itemType: itemType,
    itemName: itemName || t("deleteModal.thisItem", "this item"),
    defaultValue: `Are you sure you want to delete ${itemType} "${
      itemName || "this item"
    }"? All associated data will be permanently removed.`,
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              {icon || <Trash2 className="w-6 h-6 text-red-600" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500">{t("deleteModal.undo")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <p className="text-slate-600 mb-6">{message || defaultMessage}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {t(cancelText)}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 ${confirmButtonColor} text-white rounded-lg ${confirmButtonHoverColor} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("deleteModal.deleting", "Deleting...")}
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
