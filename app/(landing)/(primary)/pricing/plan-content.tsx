"use client"

import { Select, Button, Switch } from "@landing/components/Ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiStarIcon, InfoIcon, PlusIcon } from "@landing/components/Icons";
import { PAGE_SETTINGS } from "@landing/constants/Global";
import { API_BASE, ROUTES } from "@shared/contract";
import { debounce } from "@landing/utils/debounce";

interface Product {
    id: number;
    name: string;
    key: string;
}

/** A product as GET products answers it. */
type ApiProduct = {
    id: number;
    product_name: string;
    key: string;
    is_active: boolean;
    is_show_list: boolean;
};

type PlanRow = {
    id: string;
    product: Product | null;
    calls: string;        // digits only, never formatted
    error: string;
};

type BasketLine = { product_id: number; usage_count: number };

const DEBOUNCE_DELAY = 400;

// The API sells one-off credit purchases only. Until it sells subscriptions,
// the Pay-as-you-go / Subscription switch and the "30% off" badge stay hidden,
// so the page never shows a price that checkout does not charge. When they
// exist, flip this on; the subscription price is then the pay-as-you-go total
// minus SUBSCRIPTION_DISCOUNT, computed here.
const SUBSCRIPTIONS = false;
const SUBSCRIPTION_DISCOUNT = 0.30;

let __rowIdCounter = 0;
const nextRowId = () => `row_${++__rowIdCounter}`;
const newRow = (): PlanRow => ({
    id: nextRowId(),
    product: null,
    calls: "",
    error: "",
});

const parseCalls = (raw: string): number => {
    const n = parseInt(String(raw ?? "").replace(/,/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
};

/** The rows the API can price: a product and a quantity above zero. */
const basketLines = (rows: PlanRow[]): BasketLine[] =>
    rows
        .filter(r => r.product && parseCalls(r.calls) > 0)
        .map(r => ({ product_id: r.product!.id, usage_count: parseCalls(r.calls) }));

const linesKey = (lines: BasketLine[]) => lines.map(l => `${l.product_id}:${l.usage_count}`).join(",");

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
    const [basketId, setBasketId] = useState("");
    // The lines the current total belongs to, so a basket edited since its last
    // price is never handed to checkout as if it were up to date.
    const [pricedKey, setPricedKey] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [isBusy, setIsBusy] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    // Mirror the latest mutable state so the debounced fn can read fresh values
    // without being recreated (which would reset its timer on every keystroke).
    const stateRef = useRef({ rows, basketId });
    useEffect(() => {
        stateRef.current = { rows, basketId };
    });

    // Drops stale responses if a newer request has already been dispatched.
    const requestIdRef = useRef(0);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/products`);
                const { data, success } = await res.json();
                if (cancelled || !success || !Array.isArray(data)) return;
                setProducts(
                    data
                        .filter((p: ApiProduct) => p.is_active && p.is_show_list)
                        .map((p: ApiProduct) => ({ id: p.id, name: p.product_name, key: p.key }))
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

    // POST products/price prices the whole basket at once. Without `basket_id`
    // it creates one (owned by nobody until checkout claims it); with it, it
    // REPLACES that basket's lines, so every line is sent every time.
    const runPrice = useCallback(async (rowId?: string) => {
        const { rows: currentRows, basketId: currentBasketId } = stateRef.current;
        const lines = basketLines(currentRows);
        const myReqId = ++requestIdRef.current;

        if (lines.length === 0) {
            setTotalPrice(0);
            setPricedKey("");
            setIsBusy(false);
            return;
        }

        const price = async (basket: string) => {
            const res = await fetch(`${API_BASE}/products/price`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ details: lines, basket_id: basket || undefined }),
            });
            return { res, json: await res.json().catch(() => ({})) };
        };

        setIsBusy(true);
        try {
            let { res, json } = await price(currentBasketId);
            // A basket the server no longer knows: start a new one.
            if (res.status === 404 && currentBasketId) ({ res, json } = await price(""));

            // Ignore stale responses
            if (myReqId !== requestIdRef.current) return;

            if (res.ok) {
                if (json.basket_id) setBasketId(json.basket_id);
                setTotalPrice(Number(json.total_price) || 0);
                setPricedKey(linesKey(lines));
                setRows(prev => prev.map(r => (r.error ? { ...r, error: "" } : r)));
            } else {
                // Per-line failures name the product in `product_id`.
                const message = json.error || json.message || "Unable to calculate pricing.";
                const failed = currentRows.find(r => r.product && r.product.id === json.product_id);
                const target = failed?.id ?? rowId ?? currentRows[0]?.id;
                if (target) patchRow(target, { error: message });
            }
            setIsBusy(false);
        } catch (err) {
            if (myReqId !== requestIdRef.current) return;
            console.error("Pricing calculation failed", err);
            if (rowId) patchRow(rowId, { error: "Network error — please retry." });
            setIsBusy(false);
        }
    }, [patchRow]);

    // Created once: the debounce timer is preserved across renders so rapid edits
    // actually coalesce into a single backend call.
    const debouncedPrice = useMemo(
        () => debounce((rowId?: string) => { runPrice(rowId); }, DEBOUNCE_DELAY),
        [runPrice]
    );

    useEffect(() => () => debouncedPrice.cancel(), [debouncedPrice]);

    const handleProductChange = (rowId: string, nextProduct: Product) => {
        setRows(prev => prev.map(r => (r.id === rowId ? { ...r, product: nextProduct, error: "" } : r)));
        debouncedPrice(rowId);
    };

    const handleCallsChange = (rowId: string, raw: string) => {
        const digits = raw.replace(/\D/g, "");
        setRows(prev => prev.map(r =>
            r.id === rowId ? { ...r, calls: digits, error: "" } : r
        ));
        debouncedPrice(rowId);
    };

    const handleRemoveRow = (rowId: string) => {
        setRows(prev => prev.filter(r => r.id !== rowId));
        debouncedPrice();
    };

    const handleAddRow = () => setRows(prev => [...prev, newRow()]);

    const totalCalls = useMemo(
        () => rows.reduce((sum, r) => sum + parseCalls(r.calls), 0),
        [rows]
    );

    const lines = useMemo(() => basketLines(rows), [rows]);
    const isPriced = lines.length > 0 && pricedKey === linesKey(lines);
    const totalCredits = lines.reduce((sum, l) => sum + l.usage_count, 0);

    // Hands the basket to the dashboard checkout, which claims it for the
    // signed-in user (signing in first if needed) and opens Buy credits with
    // it. A basket edited since its last price goes as `?plan=` instead, and
    // checkout prices it again, so the user never pays for a stale basket.
    const checkoutHref = useMemo(() => {
        // No plan yet: the checkout page sends the user on to Buy credits.
        if (lines.length === 0) return ROUTES.checkout;
        const params = new URLSearchParams(
            isPriced && basketId ? { basket_id: basketId } : { plan: linesKey(lines) }
        );
        return `${ROUTES.checkout}?${params.toString()}`;
    }, [lines, isPriced, basketId]);

    const subtitleClass = "text-sm sm:text-base lg:text-sm xl:text-base font-medium text-nature-black";

    const payAsYouGoPrice = lines.length > 0 ? totalPrice : 0;
    const subscriptionPrice = payAsYouGoPrice * (1 - SUBSCRIPTION_DISCOUNT);
    const discountAmount = payAsYouGoPrice * SUBSCRIPTION_DISCOUNT;

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
                                                placeholder="Files/API calls, e.g. 5,000"
                                                className={`w-full lg:w-auto app-input mr-7 placeholder:text-sm ${index === 0 ? 'mr-0! !lg:mr-7' : ''
                                                    } ${row.error ? 'border-red-500 focus:border-red-500' : ''
                                                    }`}
                                                change={(e) => handleCallsChange(row.id, e.target.value)}
                                            />
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
                                {SUBSCRIPTIONS && (
                                    <>
                                        <div className="ml-3">
                                            <Switch checked={isChecked} onCheckedChange={setIsChecked} className="mt-[3px]" />
                                        </div>
                                        <span className={`${subtitleClass} text-gray-default! ml-3`}>Subscription</span>
                                        <div className="inline-flex items-center rounded-full bg-white ml-2 py-1.5 px-3">
                                            <AiStarIcon />
                                            <span className="text-sm font-medium ml-2">30% off</span>
                                        </div>
                                    </>
                                )}
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
                                {SUBSCRIPTIONS ? (
                                    <div className="inline-flex items-center rounded-full bg-white ml-2 py-1.5 px-3">
                                        <AiStarIcon />
                                        <span className="text-sm font-medium ml-2">30% off</span>
                                    </div>
                                ) : (
                                    <span className={`${subtitleClass} text-gray-default!`}>Pay-as-you-go</span>
                                )}
                            </div>
                            {SUBSCRIPTIONS && (
                                <div className="flex justify-end items-center text-right">
                                    <span className={`${subtitleClass} text-gray-default!`}>Pay-as-you-go</span>
                                    <div>
                                        <div className="ml-3 inline-block">
                                            <Switch checked={isChecked} onCheckedChange={setIsChecked} className="mt-[3px]" />
                                        </div>
                                        <span className={`${subtitleClass} text-gray-default! ml-3`}>Subscription</span>
                                    </div>
                                </div>
                            )}
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
                                    <span className="text-app-blue text-2xl font-medium">{totalCredits.toLocaleString("en-US")}</span>
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
