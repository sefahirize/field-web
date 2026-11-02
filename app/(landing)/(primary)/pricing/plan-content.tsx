"use client"

import { Select, Button, Switch } from "@landing/components/Ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiStarIcon, InfoIcon, PlusIcon } from "@landing/components/Icons";
import { DASHBOARD_API_URL as USE_API_URL, PAGE_SETTINGS } from "@landing/constants/Global";
import { ROUTES } from "@shared/contract";
import { debounce } from "@landing/utils/debounce";

interface Product {
    id: number;
    name: string;
    description: string;
    key: string;
    icon: string;
    price: string | null;
    tooltip: { title: string; description: string };
    is_active: boolean;
}

type LatestInfo = {
    annual_price: number;
    total_discount: number;
    discount_price: number;
    discount_ratio: number;
    price: number;
    total_credit: string;
    total_price: string;
};

type PlanRow = {
    id: string;
    product: Product | null;
    calls: string;        // digits only, never formatted
    fetched: boolean;     // true once the backend has persisted this row's product on the plan
    loading: boolean;
    error: string;
};

const DEBOUNCE_DELAY = 400;
const MIN_DOCUMENT_COUNT = 1000;

// TEMP: backend subscription discount math is broken. While `true`, the
// pay-as-you-go price still comes from the API, but the subscription price
// and "SAVE $X" badge are computed on the client as a flat 30% off.
// Flip back to `false` once the API is fixed to restore server-driven values.
const DISCOUNT_MANUALLY = true;
const MANUAL_DISCOUNT_RATIO = 0.30;

const EMPTY_INFO: LatestInfo = {
    annual_price: 0,
    total_discount: 0,
    discount_price: 0,
    discount_ratio: 0,
    price: 0,
    total_credit: "0",
    total_price: "0",
};

let __rowIdCounter = 0;
const nextRowId = () => `row_${++__rowIdCounter}`;
const newRow = (): PlanRow => ({
    id: nextRowId(),
    product: null,
    calls: "",
    fetched: false,
    loading: false,
    error: "",
});

const parseCalls = (raw: string): number => {
    const n = parseInt(String(raw ?? "").replace(/,/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
};

// Strip trailing `.00` so $0.00 → $0, $199.00 → $199, but $199.50 stays $199.50
const formatPrice = (value: number | string): string => {
    const n = typeof value === "string" ? parseFloat(value) : value;
    const safe = Number.isFinite(n) ? n : 0;
    return Number.isInteger(safe) ? String(safe) : safe.toFixed(2);
};

interface CardPriceProps { children: React.ReactNode }

const CardPrice = ({ children }: CardPriceProps) => (
    <div className="card-price relative p-5 xl:pt-11 xl:pb-16 xl:px-14">
        <div className="absolute inset-0 overflow-hidden">
            <img src="/assets/images/pages/pricing-bg.png" alt="" className="absolute top-0 left-0 w-full" />
        </div>
        <div className="relative z-10">{children}</div>
    </div>
);

const NumberInput: React.FC<
    React.InputHTMLAttributes<HTMLInputElement> & { change: (e: React.ChangeEvent<HTMLInputElement>) => void }
> = ({ change, ...rest }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const rawValue = input.value.replace(/\D/g, "");
        const oldLength = input.value.length;
        const cursorPos = input.selectionStart ?? input.value.length;
        const formattedValue = rawValue ? Number(rawValue).toLocaleString("en-US") : "";
        input.value = formattedValue;
        const newCursorPos = cursorPos + (formattedValue.length - oldLength);
        setTimeout(() => {
            input.setSelectionRange(newCursorPos, newCursorPos);
            change(e);
        }, 0);
    };
    return <input type="text" onChange={handleChange} {...rest} />;
};

const PlanContent = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [rows, setRows] = useState<PlanRow[]>(() => [newRow()]);
    const [purchasePlanId, setPurchasePlanId] = useState<number | string>("");
    const [publicId, setPublicId] = useState<number | string>("");
    const [latestInfo, setLatestInfo] = useState<LatestInfo>(EMPTY_INFO);
    const [isChecked, setIsChecked] = useState(false);

    // Mirror the latest mutable state so the debounced fn can read fresh values
    // without being recreated (which would reset its timer on every keystroke).
    const stateRef = useRef({ rows, purchasePlanId, publicId });
    useEffect(() => {
        stateRef.current = { rows, purchasePlanId, publicId };
    });

    // Remembers the persisted product id when a row's product is swapped, so the
    // eventual /change-product POST still references the original backend line —
    // even after several back-to-back swaps before the first response lands.
    const pendingSwapFromRef = useRef<Record<string, number>>({});

    // Drops stale responses if a newer request has already been dispatched.
    const requestIdRef = useRef(0);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${USE_API_URL}/product/public/all`);
                const { data, success } = await res.json();
                if (cancelled || !success || !Array.isArray(data)) return;
                setProducts(
                    data.map((p: Product) => ({
                        ...p,
                        icon: `/assets/icons/new/${p.key}.png`,
                    }))
                );
            } catch (err) {
                console.error("Failed to load products", err);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const patchRow = useCallback((rowId: string, patch: Partial<PlanRow>) => {
        setRows(prev => prev.map(r => (r.id === rowId ? { ...r, ...patch } : r)));
    }, []);

    const runCalculate = useCallback(async (rowId: string) => {
        const { rows: currentRows, purchasePlanId: planId, publicId: pubId } = stateRef.current;
        const row = currentRows.find(r => r.id === rowId);
        if (!row || !row.product) return;
        const calls = parseCalls(row.calls);
        if (calls < MIN_DOCUMENT_COUNT) return;

        const myReqId = ++requestIdRef.current;
        const swapFromId = pendingSwapFromRef.current[rowId];
        const isSwap = !!swapFromId && swapFromId !== row.product.id;

        const body: Record<string, unknown> = {
            product_id: isSwap ? swapFromId : row.product.id,
            document_count: calls,
            purchase_plan_id: planId || undefined,
        };
        if (isSwap) {
            body.new_product_id = row.product.id;
            body.public_id = pubId || undefined;
        }
        const endpoint = isSwap ? "change-product" : "public-calculation";

        patchRow(rowId, { loading: true, error: "" });
        try {
            const res = await fetch(`${USE_API_URL}/purchase/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await res.json();

            // Ignore stale responses
            if (myReqId !== requestIdRef.current) return;

            if (json.success && json.data?.info) {
                setLatestInfo(json.data.info);
                if (json.data.id) setPurchasePlanId(json.data.id);
                if (json.data.public_id) setPublicId(json.data.public_id);
                delete pendingSwapFromRef.current[rowId];
                patchRow(rowId, { fetched: true, loading: false, error: "" });
            } else {
                patchRow(rowId, {
                    loading: false,
                    error: json.message || "Unable to calculate pricing.",
                });
            }
        } catch (err) {
            if (myReqId !== requestIdRef.current) return;
            console.error("Pricing calculation failed", err);
            patchRow(rowId, { loading: false, error: "Network error — please retry." });
        }
    }, [patchRow]);

    // Created once: the debounce timer is preserved across renders so rapid edits
    // actually coalesce into a single backend call.
    const debouncedCalculate = useMemo(
        // debounce only stores the callback; refs are read when the timer fires, not during render.
        // eslint-disable-next-line react-hooks/refs
        () => debounce((rowId: string) => { runCalculate(rowId); }, DEBOUNCE_DELAY),
        [runCalculate]
    );

    useEffect(() => () => debouncedCalculate.cancel(), [debouncedCalculate]);

    const handleProductChange = (rowId: string, nextProduct: Product) => {
        setRows(prev => prev.map(r => {
            if (r.id !== rowId) return r;
            if (r.fetched && r.product && r.product.id !== nextProduct.id) {
                if (!pendingSwapFromRef.current[rowId]) {
                    pendingSwapFromRef.current[rowId] = r.product.id;
                }
            }
            return { ...r, product: nextProduct, fetched: false, error: "" };
        }));
        debouncedCalculate(rowId);
    };

    const handleCallsChange = (rowId: string, raw: string) => {
        const digits = raw.replace(/\D/g, "");
        setRows(prev => prev.map(r =>
            r.id === rowId ? { ...r, calls: digits, error: "" } : r
        ));
        debouncedCalculate(rowId);
    };

    const deletePersistedRow = useCallback(async (row: PlanRow) => {
        if (!row.product) return;
        debouncedCalculate.cancel();
        const myReqId = ++requestIdRef.current;
        try {
            const { purchasePlanId: planId, publicId: pubId } = stateRef.current;
            const res = await fetch(`${USE_API_URL}/purchase/public-delete-product-calculation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    delete_product_id: row.product.id,
                    plan_id: planId,
                    public_id: pubId,
                }),
            });
            const json = await res.json();
            if (myReqId !== requestIdRef.current) return;
            if (!json.success) return;
            if (json.data?.info) setLatestInfo(json.data.info);
            if (json.message === "Plan deleted") {
                setPurchasePlanId("");
                setPublicId("");
                setLatestInfo(EMPTY_INFO);
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    }, [debouncedCalculate]);

    const handleRemoveRow = async (rowId: string) => {
        const row = stateRef.current.rows.find(r => r.id === rowId);
        if (!row) return;
        if (row.fetched) {
            await deletePersistedRow(row);
        }
        delete pendingSwapFromRef.current[rowId];
        setRows(prev => prev.filter(r => r.id !== rowId));
    };

    const handleAddRow = () => setRows(prev => [...prev, newRow()]);

    const totalCalls = useMemo(
        () => rows.reduce((sum, r) => sum + parseCalls(r.calls), 0),
        [rows]
    );

    // Hands the configured plan off to the dashboard checkout, which replays it
    // into the authenticated cart (`?plan=<productId>:<count>,...`). `pp` carries
    // the anonymous plan ids for a future server-side claim endpoint.
    const checkoutHref = useMemo(() => {
        const lines = rows
            .filter(r => r.product && parseCalls(r.calls) >= MIN_DOCUMENT_COUNT)
            .map(r => `${r.product!.id}:${parseCalls(r.calls)}`)
            .join(",");
        // No plan yet: the checkout page sends the user on to Buy credits.
        if (!lines) return ROUTES.checkout;
        const params = new URLSearchParams({
            plan: lines,
            billing: isChecked ? "sub" : "payg",
        });
        if (purchasePlanId && publicId) params.set("pp", `${purchasePlanId}_${publicId}`);
        return `${ROUTES.checkout}?${params.toString()}`;
    }, [rows, isChecked, purchasePlanId, publicId]);

    const isBusy = rows.some(r => r.loading);

    const subtitleClass = "text-sm sm:text-base lg:text-sm xl:text-base font-medium text-nature-black";

    const payAsYouGoPrice = parseFloat(String(latestInfo.total_price)) || 0;
    const subscriptionPrice = DISCOUNT_MANUALLY
        ? payAsYouGoPrice * (1 - MANUAL_DISCOUNT_RATIO)
        : (typeof latestInfo.price === "number" ? latestInfo.price : parseFloat(String(latestInfo.price)) || 0);
    const discountAmount = DISCOUNT_MANUALLY
        ? payAsYouGoPrice * MANUAL_DISCOUNT_RATIO
        : parseFloat(String(latestInfo.discount_price)) || 0;

    return (
        <div className="max-w-1304 mx-auto px-3 xl:px-0">
            <div className=" lg:flex items-start justify-between gap-x-3">
                <div className="lg:w-full lg:max-w-[700px] relative">
                    <CardPrice>
                        <div className="grid grid-cols-2 gap-x-8 items-center border-b border-gray-border-dark pb-3 px-5">
                            <span className={subtitleClass}>I need to use</span>
                            <span className={subtitleClass}>With total files/API calls needed</span>
                        </div>
                        {rows.map((row, index) => {
                            const callsNumber = parseCalls(row.calls);
                            const callsBelowMin = !!row.calls && callsNumber < MIN_DOCUMENT_COUNT;
                            return (
                                <div key={row.id} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                                    <div className="col-span-1">
                                        <Select
                                            options={products}
                                            hideItems={rows.map(r => r.product?.id)}
                                            value={row.product || ''}
                                            labelKey="name"
                                            valueKey="id"
                                            returnObject={true}
                                            onChange={(newValue) => handleProductChange(row.id, newValue as Product)}
                                            placeholder="Select Product"
                                            rounded={true}
                                            className="w-full lg:max-w-[320px]"
                                        />
                                    </div>
                                    <div className="col-span-1 flex items-center mt-5 lg:mt-0">
                                        <div>
                                            <NumberInput
                                                type="text"
                                                inputMode="numeric"
                                                pattern="\d*"
                                                disabled={!row.product}
                                                placeholder={`Min ${MIN_DOCUMENT_COUNT.toLocaleString()} files/API calls`}
                                                className={`w-full lg:w-auto app-input mr-7 placeholder:text-sm ${index === 0 ? 'mr-0! !lg:mr-7' : ''
                                                    } ${callsBelowMin ? 'border-red-500 focus:border-red-500' : ''
                                                    }`}
                                                change={(e) => handleCallsChange(row.id, e.target.value)}
                                            />
                                            {callsBelowMin && (
                                                <div className="mt-1 text-red-500 text-xs">
                                                    Minimum {MIN_DOCUMENT_COUNT.toLocaleString()} files/API calls required
                                                </div>
                                            )}
                                            {row.error && (
                                                <div className="mt-1 text-red-500 text-xs">{row.error}</div>
                                            )}
                                        </div>
                                        <div className={`w-12 h-8 ${index === 0 ? 'hidden! !lg:block' : ''}`}>
                                            {index > 0 && (
                                                <button
                                                    className="w-8 h-8 hover:opacity-80 transition-opacity"
                                                    onClick={() => handleRemoveRow(row.id)}
                                                >
                                                    <img
                                                        src="/assets/images/icons/trash.png"
                                                        className="w-8 h-8"
                                                        alt="Remove endpoint"
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {rows.length < products.length && (
                            <div className="mt-8">
                                <button onClick={handleAddRow} className="text-app-blue flex items-center">
                                    <PlusIcon />
                                    <span className="text-sm font-normal pl-2.5">Add API Endpoint</span>
                                </button>
                            </div>
                        )}
                    </CardPrice>
                </div>
                <div className="lg:w-full lg:flex-1 mt-10 lg:mt-0 relative">
                    {isBusy && (
                        <div className="hidden xl:flex absolute left-4 top-1 bg-white/50 items-start justify-end pr-4 pt-4 z-30">
                            <div className="w-5 h-5 border-[2px] border-t-transparent border-b-transparent border-r-transparent border-l-natural-navy rounded-full animate-spin" />
                        </div>
                    )}
                    <CardPrice>
                        {/* xl */}
                        <div className="hidden xl:flex items-center justify-between w-full">
                            <span className={subtitleClass}>Total</span>
                            <div className="flex items-center">
                                <span className={`${subtitleClass} text-gray-default!`}>Pay-as-you-go</span>
                                <div className="ml-3">
                                    <Switch checked={isChecked} onCheckedChange={setIsChecked} className="mt-[3px]" />
                                </div>
                                <span className={`${subtitleClass} text-gray-default! ml-3`}>Subscription</span>
                                <div className="inline-flex items-center rounded-full bg-white ml-2 py-1.5 px-3">
                                    <AiStarIcon />
                                    <span className="text-sm font-medium ml-2">30% off</span>
                                </div>
                            </div>
                        </div>
                        {/* other */}
                        <div className="xl:hidden">
                            <div className="flex justify-between w-full">
                                <span className={`${subtitleClass} flex items-center`}>
                                    Total
                                    {isBusy && (
                                        <div className="ml-2 w-4 h-4 border-[2px] border-t-transparent border-b-transparent border-r-transparent border-l-natural-navy rounded-full animate-spin" />
                                    )}
                                </span>
                                <div className="inline-flex items-center rounded-full bg-white ml-2 py-1.5 px-3">
                                    <AiStarIcon />
                                    <span className="text-sm font-medium ml-2">30% off</span>
                                </div>
                            </div>
                            <div className="flex justify-end items-center text-right">
                                <span className={`${subtitleClass} text-gray-default!`}>Pay-as-you-go</span>
                                <div>
                                    <div className="ml-3 inline-block">
                                        <Switch checked={isChecked} onCheckedChange={setIsChecked} className="mt-[3px]" />
                                    </div>
                                    <span className={`${subtitleClass} text-gray-default! ml-3`}>Subscription</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-9">
                            <div className="md:grid lg:block lgx:grid grid-cols-2 gap-x-[50px]">
                                <div className="flex items-center px-4 py-[18px] rounded-lg bg-natural-gray-bg shadow-[0px_0px_0px_1px_rgba(9,25,72,0.13),0px_1px_2px_0px_rgba(18,55,105,0.08)]">
                                    <span className="text-app-blue text-2xl font-medium">
                                        ${isChecked
                                            ? formatPrice(subscriptionPrice)
                                            : formatPrice(payAsYouGoPrice)
                                        }
                                    </span>
                                    <span className="text-base font-semibold text-gray-default ml-4">Price</span>
                                </div>
                                <div className="mt-5 md:mt-0 lg:mt-5 lgx:mt-0 flex items-center px-4 py-[18px] rounded-lg bg-natural-gray-bg shadow-[0px_0px_0px_1px_rgba(9,25,72,0.13),0px_1px_2px_0px_rgba(18,55,105,0.08)]">
                                    <span className="text-app-blue text-2xl font-medium">{latestInfo.total_credit}</span>
                                    <span className="text-base font-semibold text-gray-default ml-4">Credits</span>
                                </div>
                            </div>
                        </div>
                        {isChecked && payAsYouGoPrice > 0 && (
                            <div className="mt-4 flex items-center gap-x-10">
                                <span className="text-[#95959B] relative px-2.5">
                                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[rgba(223,28,63,0.8)]"></div>
                                    <span className="relative z-10">
                                        ${formatPrice(payAsYouGoPrice)}
                                    </span>
                                </span>
                                <span className="bg-[#40C4AA]/20 text-[#40C4AA] inline-block rounded-full px-3 py-2 text-[13px] font-semibold">
                                    SAVE ${formatPrice(discountAmount)}
                                </span>
                            </div>
                        )}
                        <div className={isChecked ? "mt-4" : "mt-14"}>
                            <div className="border-t border-t-gray-border-dark pt-9">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-default">Total Calls</span>
                                    <span className="text-sm font-medium text-gray-default">
                                        {totalCalls.toLocaleString()} {totalCalls === 1 ? 'Call' : 'Calls'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="rounded-lg flex items-center py-2.5 pl-4 pr-2 bg-[rgba(204,212,255,0.5)] shadow-[0px_0px_0px_1px_rgba(9,25,72,0.13),0px_1px_2px_0px_rgba(18,55,105,0.08)]">
                                <InfoIcon />
                                <p className="text-sm font-medium ml-2.5 text-[#6B7280] flex-1">
                                    {isChecked ?
                                        "Subscriptions run for a 12-month term, are billed monthly, credits are added to your account each month."
                                        :
                                        "With the pay-as-you-go plan, you buy all credits in one purchase. Credits expire after 12 months."}
                                </p>
                            </div>
                        </div>
                        <div className="mt-11 md:flex lg:block lgx:flex items-center justify-between gap-x-9">
                            <Button link href={checkoutHref} className="rounded-full! bg-app-blue! text-white!">
                                <span className="text-sm font-medium">Check out</span>
                            </Button>
                            <Button link href={PAGE_SETTINGS.contact.href + `?information=sales`} variant="transparent-black" className="rounded-full! mt-5 md:mt-0 lg:mt-5 lgx:mt-0">
                                <span className="text-sm font-medium">Contact Sales</span>
                            </Button>
                        </div>
                    </CardPrice>
                </div>
            </div>
        </div>
    );
};

export default PlanContent;
