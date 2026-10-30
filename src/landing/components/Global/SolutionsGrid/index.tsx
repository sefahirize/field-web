import { FC } from "react";
import SolutionsGridItem from "./item";
import { Feature } from "@landing/interfaces/global/Solutions.interfaces";

interface SolutionsGridProps {
    data: Feature[];
    columns?: 2 | 3;
    className?: string;
}

const SolutionsGrid: FC<SolutionsGridProps> = ({ data, columns = 2, className }) => {
    const maxWidth = columns === 3 ? "max-w-[1275px]" : "max-w-[840px]";
    const gridCols = columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

    return (
        <div className={`${maxWidth} mx-auto grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-x-[30px] gap-y-5 ${className ?? ""}`}>
            {data.map((feature, index) => (
                <SolutionsGridItem key={index} feature={feature} className={feature.className} index={index} />
            ))}
        </div>
    );
};

export default SolutionsGrid;
