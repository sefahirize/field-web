"use client"
import { Section } from "@landing/components/Global";
import Link from "next/link";
import { GetStarted } from "@landing/components/Layout";
// import { PlayCircle } from "@landing/components/Icons";
import { useState } from "react";
import { Brands } from "@landing/components/Layout";
import { DATA_TUTORIAL_LIST } from "@landing/constants/Global";


const TutorialsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = DATA_TUTORIAL_LIST.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Section className="pb-0!">
                <div className="py-16 max-w-lg mx-auto">
                    <div className="rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/assets/images/tutorials/hero.png)" }}>
                        <div className="pt-10 pb-[60px]">
                            <p className="text-white text-center text-sm font-semibold">
                                Tutorials
                            </p>
                            <h1 className="text-white text-center text-[40px] font-semibold mt-3">
                                Learn. Build. Scale.
                            </h1>
                            <p className="text-white text-center text-sm font-normal mt-6">Your Guide to Maximizing Field Solutions</p>
                            <div className="mt-6 text-center">
                                <div className="relative inline-block">
                                    <img src="/assets/icons/search.svg" alt="search" className="absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-natural-gray-border px-4 py-2 pl-12 max-w-[332px] mx-auto placeholder:text-natural-gray-default placeholder:text-sm right-0 outline-hidden"
                                        placeholder="Search.."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section className="pt-0! pb-14!">
                <div className="max-w-lg mx-auto">
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-3 lg:px-0">
                            {filteredItems.map((item, index) => (
                                <div key={index} className="relative will-change-transform will-change-opacity group rounded-2xl transition-all duration-300 lg:hover:scale-[1.03] ">
                                    {item.id && (
                                        <Link href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank" className="absolute inset-0 z-10" />
                                    )}
                                    <div className="relative h-[224px] rounded-lg overflow-hidden">
                                        <img src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`} alt={item.title} className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {/* <PlayCircle /> */}
                                            <img
                                                className="w-[56px] h-[56px] will-change-transform group-hover:scale-110 transition-all duration-300"
                                                src="/assets/images/tutorials/play-circle.png" alt="play" />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-natural-navy text-lg font-semibold">{item.title}</h3>
                                        <p className="text-natural-gray-default text-base font-normal mt-3">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-natural-navy text-xl font-semibold">No tutorials found</h3>
                            <p className="text-natural-gray-default mt-2">
                                Try adjusting your search terms or browse all tutorials
                            </p>
                        </div>
                    )}
                </div>
            </Section>


            <Brands title="Trusted by leading brands" cardType="bordered" />
            <GetStarted />
            
        </div>
    );
};

export default TutorialsPage;
