import { usePage, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeftFromLine, ShieldAlert } from "lucide-react";

export function ImpersonationBanner() {
    const { t } = useTranslation();
    const props = usePage().props as any;

    if (!props.isImpersonating) {
        return null;
    }

    const userName = props.auth?.user?.name || "";

    return (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between gap-3 text-sm shadow-md z-50">
            <div className="flex items-center gap-2 min-w-0">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                    {t("You are viewing as")} <strong>{userName}</strong>
                </span>
            </div>
            <button
                onClick={() => router.post(route("impersonate.leave"))}
                className="inline-flex items-center gap-1.5 rounded-md bg-white text-red-600 px-3 py-1 text-xs font-semibold hover:bg-red-50 transition-colors flex-shrink-0 shadow-sm"
            >
                <ArrowLeftFromLine className="h-3.5 w-3.5" />
                {t("Return to Admin")}
            </button>
        </div>
    );
}
