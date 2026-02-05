interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutConfirmModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">ออกจากระบบ</h2>
        <p className="text-sm text-gray-600">
          คุณต้องการออกจากระบบใช่หรือไม่?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded border px-4 py-2 text-sm"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
