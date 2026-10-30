import Link from "next/link";
import { exploreData, ExploreSection } from "./data";
import { CheckBlackCircle, ArrowRight } from "@landing/components/Icons";
import { DOCUMENTATION_URL } from "@landing/constants/Global";

const ExploreCard = ({ item }: { item: ExploreSection }) => {

    const { items: products } = item;

    return (
        <div className="bg-white rounded-[32px] p-11">
            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-2 gap-11">
                {products.map((product, index) => (
                    <div key={index} className="col-span-1 sm:col-span-2 sm:col-start-2 lg:col-start-auto lg:col-span-1">
                        <h3 className="text-xl font-medium text-nature-black">{product.title}</h3>
                        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="space-y-3.5">
                                {product.list.map((item, index) => (
                                    <div key={index} className="flex items-center gap-x-2.5">
                                        <CheckBlackCircle className="!w-[15px] !h-[15px]" />
                                        <p className="text-sm font-normal text-black flex-1">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-[10px] font-normal text-black">{product.credit.title}</p>
                                <p className="mt-2.5 text-sm font-bold text-black">{product.credit.numb}</p>
                                {product.credit.desc && (
                                    <p className="text-[10px] mt-5 font-normal text-black">{product.credit.desc}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const Explore = () => {
    return (
        <div className="pt-11 pb-24 bg-natural-navy">
            <div className="max-w-1304 mx-auto px-3 xl:px-0">
                <h2 className="text-5xl font-semibold text-white">Explore our latest models</h2>
                <div className="mt-5 space-y-5">
                    {exploreData.map((item, index) => (
                        <ExploreCard key={index} item={item} />
                    ))}
                </div>
                <div className="text-center mt-5">
                    <Link href={DOCUMENTATION_URL} className="inline-flex items-center gap-x-5 text-sm font-semibold text-auxiliary-blue-tint transition-all duration-300 hover:gap-x-2.5">
                        Check out documentation for more details
                        <ArrowRight color="#E1DDFE" />
                    </Link>

                </div>
            </div>

        </div>
    )
}

export default Explore;