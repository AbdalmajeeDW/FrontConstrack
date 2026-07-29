import { toast } from "sonner";

export default function confirmAction  (message: string, action: () => void){
  toast.custom(
    (t) => (
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-auto">
        <p className="text-gray-800 font-medium mb-4 text-center">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              action();
            }}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "bottom-left",
    }
  );
};