"use client"

import { Select, Button, Switch } from "@landing/components/Ui";
import { useEffect, useState, useCallback } from "react";
import { AiStarIcon, InfoIcon, PlusIcon } from "@landing/components/Icons";
// import { DASHBOARD_API_URL_DEV as USE_API_URL } from '@landing/constants/Global';
import { DASHBOARD_API_URL as USE_API_URL } from '@landing/constants/Global';
import { debounce } from '@landing/utils/debounce';
import { PAGE_SETTINGS, APP_URL } from "@landing/constants/Global";
interface CardPriceProps {
    children: React.ReactNode;
}

type LatestInfo = {
    annual_price: number;
    total_discount: number;
    discount_price: number;
    discount_ratio: number;
    price: number;
    total_credit: string;
    total_price: string;
}

type RequestBody = {
    product_id?: string | number;
    document_count?: string | number;
    purchase_plan_id?: string | number;
    new_product_id?: string | number;
    public_id?: string | number;
}


interface Product {
    id: number;
    name: string;
    description: string;
    key: string;
    icon: string;
    price: string | null;
    tooltip: {
        title: string;
        description: string;
    };
    is_active: boolean;
}

// interface ApiEndpoint {
//     id: string;
//     product: string;  // This will store the product key
//     calls: string;
// }

// interface CalculationResponse {
//     success: boolean;
//     data: {
//         price: number;
//         // add other response fields as needed
//     };
// }

// type CalculationRequest = {
//     product_id: number;
//     document_count: number;
// }[];

// Add new interface for calculation results
// interface ProductCalculation {
//     productId: number;
//     price: number;
//     credits: number;
//     totalCalls: number;
//     totalPages: number;
// }

interface ProductOption {
    error?: string;
    calls?: number | string
    product?: Product | null
    fetched?: boolean
}

// interface subScriptionDetails {
//     discount_price: number;
//     total_credit: number;
//     total_price: number;
//     total_discount: number;
// }

const DEBOUNCE_DELAY = 300; // Increase debounce delay to 1 second
const MIN_DOCUMENT_COUNT = 1000;

const CardPrice = ({ children }: CardPriceProps) => {
    return (
        <div className="card-price relative p-5 xl:pt-11 xl:pb-16 xl:px-14">
            <div className="absolute inset-0 overflow-hidden">
                <img src="/assets/images/pages/pricing-bg.png" alt="" className="absolute top-0 left-0 w-full" />
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

// Helper function to format price with comma
const formatPrice = (price: number | string, replaceComma: boolean = true) => {
    const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
    return replaceComma ? priceNumber.toFixed(2).replace('.', ',') : priceNumber.toFixed(2);
};

// Add this helper function at the top with other helpers
// const formatNumberWithCommas = (value: string) => {
//     // Remove any non-digit characters
//     const numbers = value.replace(/\D/g, '');
//     // Add commas using toLocaleString
//     return numbers ? parseInt(numbers).toLocaleString() : '';
// };

const PlanContent = () => {

    // const options = [
    //     { label: "Resume Parser", value: "option1", icon: "/assets/images/icons/resume.svg" },
    //     { label: "Field Fin / Invoice Parser", value: "option2", icon: "/assets/images/icons/fin.svg" },
    //     { label: "Job Parser", value: "option3", icon: "/assets/images/icons/job.svg" },
    //     { label: "AI Matching", value: "option4", icon: "/assets/images/icons/ai.svg" },
    //     { label: "Field IQ", value: "option5", icon: "/assets/images/icons/iq.svg" },
    //     { label: "Field Lumina", value: "option6", icon: "/assets/images/icons/lumina.svg" },
    // ]

    const [purchase_plan_id, setPurchasePlanId] = useState<number | string>("");
    const [public_id, setPublicId] = useState<number | string>("");
    const [products, setProducts] = useState<Product[]>([]);
    const [redirectId, setRedirectId] = useState<number | string>("");
    const [selectedProducts, setSelectedProducts] = useState<ProductOption[]>([
        {
            error: '',
            calls: '',
            product: null,
            fetched: false
        }
    ]);
    const [isChecked, setIsChecked] = useState(false);
    const [latestInfo, setLatestInfo] = useState<LatestInfo>({
        annual_price: 0,
        total_discount: 0,
        discount_price: 0,
        discount_ratio: 0,
        price: 0,
        total_credit: "0",
        total_price: "0",
    });
    const [loader, setLoader] = useState(false);

    const [totalCalls, setTotalCalls] = useState<number>(0);

    useEffect(() => {

        if (purchase_plan_id && public_id) {
            setRedirectId(`${purchase_plan_id}_${public_id}`);
        } else {
            setRedirectId("");
        }

    }, [purchase_plan_id, public_id]);


    useEffect(() => {
        const fetchProducts = async () => {
            // const response = await fetch(`${DASHBOARD_API_URL}/product/public/all`);
            const response = await fetch(`${USE_API_URL}/product/public/all`);
            const { data, success } = await response.json();
            if (success) {
                const allProducts = data.map((item: Product) => ({ ...item, error: '' }))
                allProducts.forEach((product: Product) => {
                    product.icon = `/assets/icons/new/${product.key}.png`;
                });
                setProducts(allProducts);
            }
        };
        fetchProducts();
    }, []);

    // useEffect(() => {
    //     console.log("change selectedProducts", selectedProducts);
    // }, [selectedProducts]);

    // useEffect(() => {
    //     if (isChecked && public_id) {
    //         subscriptionPlan();
    //     }
    // }, [isChecked]);



    // const subscriptionPlan = async (prop_public_id?: number) => {

    //     try {
    //         setLoader(true);

    //         const requestBody = {
    //             // purchase_plan_id: purchase_plan_id,
    //             public_id: prop_public_id ? prop_public_id : public_id
    //         };

    //         const res = await fetch(`${USE_API_URL}/purchase/public-temp-purchase-plan-discount`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(requestBody),
    //         });

    //         const { data, success } = await res.json();


    //     } catch (error) {
    //         console.error('Error calculating price:', error);
    //     } finally {
    //         setLoader(false);
    //     }
    // }




    // Add new state for product calculation
    const debouncedCalculate = useCallback(
        debounce(async (option: ProductOption, updatedProductOption: ProductOption | null, updatedProducts: ProductOption[]) => {
            try {
                setLoader(true);

                const paramPurchasePlanId = purchase_plan_id;

                // if (updatedProductOption?.product) {
                //     const { purchasePlanId, isSuccess } = await deleteProduct(updatedProductOption, false);
                //     if (isSuccess) {
                //         paramPurchasePlanId = purchasePlanId;
                //     }
                // }



                if (parseInt(option.calls as string) >= MIN_DOCUMENT_COUNT && option.product) {

                    const isUpdate = updatedProductOption?.product;


                    const requestBody: RequestBody = {
                        product_id: option.product.id,
                        document_count: parseInt(option.calls as string),
                        purchase_plan_id: paramPurchasePlanId
                    };

                    if (isUpdate) {
                        requestBody.product_id = updatedProductOption?.product?.id;
                        requestBody.new_product_id = option.product?.id;
                        requestBody.public_id = public_id
                    }

                    const endpoint = isUpdate ? `change-product` : `public-calculation`;


                    const res = await fetch(`${USE_API_URL}/purchase/${endpoint}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });

                    const { data, success } = await res.json();

                    // if (isChecked) {
                    //     await subscriptionPlan(data.public_id)
                    // }

                    if (success && data.info) {
                        setLatestInfo(data.info);
                        setPurchasePlanId(data.id);
                        setPublicId(data.public_id);

                        // Update the fetched status in the updatedProducts array
                        const finalProducts = updatedProducts.map(prod => {
                            if (prod.product?.id === option.product?.id) {
                                return { ...prod, fetched: true };
                            }
                            return prod;
                        });

                        // Set the state with the final products array
                        setSelectedProducts(finalProducts);
                    }
                }
            } catch (error) {
                console.error('Error calculating price:', error);
            } finally {
                setLoader(false);
            }
        }, DEBOUNCE_DELAY),
        [products, purchase_plan_id, isChecked, selectedProducts, public_id]
    );


    const addApiEndpoint = () => {
        setSelectedProducts([...selectedProducts, { error: '', calls: '', product: null }]);
    }

    const updateEndpoint = (index: number, field: 'product' | 'calls', value: string | Product, updatedOption: ProductOption) => {

        // if (loader) return;

        const updatedProducts = [...selectedProducts];
        let updatedProductOption = null;

        if (field === 'product') {
            const previousProduct = updatedProducts[index];
            if (previousProduct && previousProduct.product && previousProduct.product.id !== (value as Product).id) {
                updatedProductOption = previousProduct;
            }

            updatedProducts[index] = {
                ...updatedProducts[index],
                product: value as Product,
                fetched: false
            };
        } else if (field === 'calls') {
            // Format the value with commas but store the raw number
            const rawValue = (value as string).replace(/,/g, '');
            updatedProducts[index] = {
                ...updatedProducts[index],
                calls: rawValue,
                fetched: updatedOption.fetched
            };
        }

        setSelectedProducts(updatedProducts);
        debouncedCalculate(updatedProducts[index], updatedProductOption, updatedProducts);
    };

    const removeEndpoint = async (product: ProductOption, indexToRemove: number) => {


        if (product.fetched) {
            await deleteProduct(product);
        }

        const updatedProducts = [...selectedProducts];
        updatedProducts.splice(indexToRemove, 1);
        setSelectedProducts(updatedProducts);
    };


    const deleteProduct = async (product: ProductOption) => {

        // if (loader) return;
        let purchasePlanId = purchase_plan_id;

        try {
            setLoader(true);

            const requestBody = {
                delete_product_id: product.product?.id,
                plan_id: purchase_plan_id,
                public_id: public_id
            };
            const res = await fetch(`${USE_API_URL}/purchase/public-delete-product-calculation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const { data, success, message } = await res.json();

            const { info } = data;


            if (info) {
                setLatestInfo(info);
            }

            if (success) {


                if (message && (message === "Plan deleted")) {
                    setPurchasePlanId("");
                    setPublicId("");
                    purchasePlanId = "";
                }

                product.fetched = false;

                // if (isChecked && fetchPlan) {
                //     await subscriptionPlan(data.public_id)
                // }
                // setSelectedProducts([...selectedProducts, product]);
            }


            return { purchasePlanId, isSuccess: success }


        } catch (error) {
            console.error('Error deleting product:', error);
            return { purchasePlanId, isSuccess: false }
        } finally {
            setLoader(false);
        }
    }



    // Convert products to select options format
    // const getAvailableOptions = () => {
    //     return products.filter((product) => !selectedProducts.some((option) => option.product?.id === product.id));
    // };

    const subtitleClass = "text-sm sm:text-base lg:text-sm xl:text-base font-medium text-nature-black"

    // Update the useEffect to calculate total calls whenever selectedProducts changes
    useEffect(() => {
        const total = selectedProducts.reduce((sum, product) => {
            const calls = product.calls ? parseInt(product.calls as string) : 0;
            return sum + (isNaN(calls) ? 0 : calls);
        }, 0);

        setTotalCalls(total);
    }, [selectedProducts]);

    const handleChangeCount = (index: number, value: string, option: ProductOption) => {
        updateEndpoint(index, 'calls', value, option)
    }




    return (
        <div className="max-w-1304 mx-auto px-3 xl:px-0">
            <div className=" lg:flex items-start justify-between gap-x-3">
                <div className="lg:w-full lg:max-w-[700px] relative">
                    {/* {
                        loader && (
                            <div className="absolute inset-0 bg-white/50 flex items-start justify-end pr-4 pt-4 z-30">
                                <div className="w-8 h-8 border-[3px] border-t-transparent border-b-transparent border-r-transparent border-l-natural-navy rounded-full animate-spin"></div>
                            </div>
                        )
                    } */}
                    <CardPrice>
                        <div className="grid grid-cols-2 gap-x-8 items-center border-b border-gray-border-dark pb-3 px-5">
                            <span className={subtitleClass}>I need to use</span>
                            <span className={subtitleClass}>With total files/API calls needed</span>
                        </div>
                        {selectedProducts.map((option, index) => (
                            <div key={`product-${option.product?.id}-${index}`} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                                <div className="col-span-1">
                                    <Select
                                        options={products}
                                        hideItems={selectedProducts.map((product) => product.product?.id)}
                                        value={option.product || ''}
                                        labelKey="name"
                                        valueKey="id"
                                        // iconRoute="/assets/icons/new"
                                        // iconKey="key"
                                        returnObject={true}
                                        onChange={(newValue) => {
                                            updateEndpoint(index, 'product', newValue, option);
                                        }}
                                        placeholder="Select Product"
                                        rounded={true}
                                        className="w-full lg:max-w-[320px]" />
                                </div>
                                <div className="col-span-1 flex items-center mt-5 lg:mt-0">
                                    <div>
                                        <NumberInput
                                            type="text"
                                            inputMode="numeric"
                                            pattern="\d*"
                                            disabled={!option.product}
                                            placeholder={`Min ${MIN_DOCUMENT_COUNT.toLocaleString()} files/API calls`}
                                            className={`w-full lg:w-auto app-input mr-7 placeholder:text-sm ${index === 0 ? '!mr-0 !lg:mr-7' : ''
                                                } ${option.calls && parseInt(option.calls as string) < MIN_DOCUMENT_COUNT
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : ''
                                                }`}
                                            // value={option.calls ? formatNumberWithCommas(option.calls as string) : ''}
                                            change={(e) => handleChangeCount(index, e.target.value, option)} />

                                        {/* <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="\d*"
                                            disabled={!option.product}
                                            placeholder={`Min ${MIN_DOCUMENT_COUNT.toLocaleString()} files/API calls`}
                                            className={`w-full lg:w-auto app-input mr-7 placeholder:text-sm ${index === 0 ? '!mr-0 !lg:mr-7' : ''
                                                } ${option.calls && parseInt(option.calls as string) < MIN_DOCUMENT_COUNT
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : ''
                                                }`}
                                            // value={option.calls ? formatNumberWithCommas(option.calls as string) : ''}
                                            onChange={(e) => handleChangeCount(index, e.target.value, option)}
                                        /> */}

                                        {option.calls && parseInt(option.calls as string) < MIN_DOCUMENT_COUNT && (
                                            <div className="mt-1 text-red-500 text-xs">
                                                Minimum {MIN_DOCUMENT_COUNT.toLocaleString()} files/API calls required
                                            </div>
                                        )}
                                    </div>
                                    <div className={`w-12 h-8 ${index === 0 ? '!hidden !lg:block' : ''}`}>
                                        {index > 0 && (
                                            <button
                                                className="w-8 h-8 hover:opacity-80 transition-opacity"
                                                onClick={() => removeEndpoint(option, index)}
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
                        ))}
                        {selectedProducts.length < products.length && (
                            <div className="mt-8">
                                <button onClick={addApiEndpoint} className="text-app-blue flex items-center">
                                    <PlusIcon />
                                    <span className="text-sm font-normal pl-2.5">Add API Endpoint</span>
                                </button>
                            </div>
                        )}
                    </CardPrice>
                </div>
                <div className="lg:w-full lg:flex-1 mt-10 lg:mt-0 relative">
                    {
                        loader && (
                            <div className="hidden xl:flex absolute left-4 top-1 bg-white/50 items-start justify-end pr-4 pt-4 z-30">
                                <div className="w-5 h-5 border-[2px] border-t-transparent border-b-transparent border-r-transparent border-l-natural-navy rounded-full animate-spin" />
                            </div>
                        )
                    }
                    <CardPrice>
                        {/* xl */}
                        <div className="hidden xl:flex items-center justify-between w-full">
                            <span className={subtitleClass}>Total</span>
                            <div className="flex items-center">
                                <span className={`${subtitleClass} !text-gray-default`}>Pay-as-you-go</span>
                                <div className="ml-3">
                                    <Switch checked={isChecked} onCheckedChange={setIsChecked} className="mt-[3px]" />
                                </div>
                                <span className={`${subtitleClass} !text-gray-default ml-3`}>Subscription</span>
                                <div className="inline-flex items-center rounded-full bg-white ml-2 py-1.5 px-3">
                                    <AiStarIcon />
                                    <span className="text-sm font-medium ml-2">30% off</span>
                                </div>
                            </div>
                        </div>
                        {/* xl */}
                        {/* other */}
                        <div className="xl:hidden">
                            <div className="flex justify-between w-full">
                                <span className={`${subtitleClass} flex items-center`}>
                                    Total
                                    {
                                        loader && (
                                            <div className="ml-2 w-4 h-4 border-[2px] border-t-transparent border-b-transparent border-r-transparent border-l-natural-navy rounded-full animate-spin" />
                                        )
                                    }
                                </span>
                                <div className="inline-flex items-center rounded-full bg-white ml-2 py-1.5 px-3">
                                    <AiStarIcon />
                                    <span className="text-sm font-medium ml-2">30% off</span>
                                </div>
                            </div>
                            <div className="flex justify-end items-center text-right">
                                <span className={`${subtitleClass} !text-gray-default`}>Pay-as-you-go</span>
                                <div>
                                    <div className="ml-3 inline-block">
                                        <Switch checked={isChecked} onCheckedChange={setIsChecked} className="mt-[3px]" />
                                    </div>
                                    <span className={`${subtitleClass} !text-gray-default ml-3`}>Subscription</span>
                                </div>
                            </div>
                        </div>
                        {/* other */}
                        <div className="mt-9">
                            <div className="md:grid lg:block lgx:grid grid-cols-2 gap-x-[50px]">
                                <div className="flex items-center px-4 py-[18px] rounded-lg bg-natural-gray-bg shadow-[0px_0px_0px_1px_rgba(9,25,72,0.13),0px_1px_2px_0px_rgba(18,55,105,0.08)]">
                                    <span className="text-app-blue text-2xl font-medium">
                                        ${isChecked
                                            ? formatPrice(latestInfo.price, false)
                                            : formatPrice(parseFloat(latestInfo.total_price as unknown as string), false)
                                        }
                                    </span>
                                    <span className="text-base font-semibold text-gray-default ml-4">Price</span>
                                </div>
                                <div className="mt-5 md:mt-0 lg:mt-5 lgx:mt-0 flex items-center px-4 py-[18px] rounded-lg bg-natural-gray-bg shadow-[0px_0px_0px_1px_rgba(9,25,72,0.13),0px_1px_2px_0px_rgba(18,55,105,0.08)]">
                                    {/* <span className="text-app-blue text-2xl font-medium">{isChecked ? latestInfo.total_credit : totalCredits}</span> */}
                                    <span className="text-app-blue text-2xl font-medium">{latestInfo.total_credit}</span>
                                    <span className="text-base font-semibold text-gray-default ml-4">Credits</span>
                                </div>
                            </div>
                        </div>
                        {isChecked && latestInfo.total_price !== "0" && (
                            <div className="mt-4 flex items-center gap-x-10">
                                <span className="text-[#95959B] relative px-2.5">
                                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[rgba(223,28,63,0.8)]"></div>
                                    <span className="relative z-10">
                                        ${formatPrice(parseFloat(latestInfo?.total_price as unknown as string), false)}
                                    </span>
                                </span>
                                <span className="bg-[#40C4AA]/20 text-[#40C4AA] inline-block rounded-full px-3 py-2 text-[13px] font-semibold">
                                    SAVE ${formatPrice(parseFloat(latestInfo?.discount_price as unknown as string), false)}
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
                                {/* <div className="flex items-center justify-between mt-2.5">
                                    <span className="text-sm font-medium text-gray-default">Total Pages</span>
                                    <span className="text-sm font-medium text-gray-default">0 Pages</span>
                                </div> */}
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
                            <Button link href={`${redirectId ? `${APP_URL}?pp=${redirectId}` : APP_URL}`} className="!rounded-full !bg-app-blue !text-white">
                                <span className="text-sm font-medium">Check out</span>
                            </Button>
                            <Button link href={PAGE_SETTINGS.contact.href + `?information=sales`} variant="transparent-black" className="!rounded-full mt-5 md:mt-0 lg:mt-5 lgx:mt-0">
                                <span className="text-sm font-medium">Contact Sales</span>
                            </Button>
                        </div>
                    </CardPrice>
                </div>
            </div>
        </div>
    )
}


const NumberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { change: (e: React.ChangeEvent<HTMLInputElement>) => void }> = (props) => {
    const { change, ...inputProps } = props;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const rawValue = input.value.replace(/\D/g, ""); // Remove non-numeric characters
        const oldLength = input.value.length;
        const cursorPos = input.selectionStart ?? input.value.length;

        // Format the number with commas
        const formattedValue = Number(rawValue).toLocaleString("en-US");

        // Update input value
        input.value = formattedValue;

        // Calculate new cursor position based on added commas
        const newLength = formattedValue.length;
        const diff = newLength - oldLength;
        const newCursorPos = cursorPos + diff;

        // Restore cursor position
        setTimeout(() => {
            input.setSelectionRange(newCursorPos, newCursorPos)
            change?.(e)
        }, 0);
    };

    return <input type="text" onChange={handleChange} {...inputProps} />;
};

export default PlanContent;