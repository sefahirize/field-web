import { FeatureCardProps } from "@landing/interfaces/global/feature.interfaces";
import Image from "next/image";
import { Button } from "@landing/components/Ui";
import Link from "next/link";




const FeatureTitle = ({ title, className }: { title: string, className?: string }) => {
    return (
        <h2 className={`text-2xl sm:text-3xl lg:text-[40px] leading-tight sm:leading-snug lg:leading-[48px] font-semibold text-natural-navy ${className || ''}`}>{title}</h2>
    )
}


const FeatureContentTitle = ({ title, className }: { title: string, className?: string }) => {
    return (
        <h3 className={`font-semibold text-base sm:text-lg leading-6 sm:leading-7 text-natural-navy ${className || ''}`}>{title}</h3>
    )
}

const FeatureContentText = ({ text, html = false, className }: { text: string | React.ReactNode, html?: boolean, className?: string }) => {
    return (
        <>
            {html ? (
                typeof text === 'string' && (
                    <p className={`text-natural-gray-default text-sm leading-5 mt-1 sm:mt-2 pr-6 ${className || ''}`} dangerouslySetInnerHTML={{ __html: text }} />
                )
            ) : (
                <p className={`text-natural-gray-default text-sm leading-5 mt-1 sm:mt-2 pr-6 ${className || ''}`}>{text}</p>
            )}
        </>
    )
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, titleClassName, contentList, buttons, image, customImage, type = "horizontal", contentMainClassName, gridClassName = "", endCustomHtml }) => {


    if (type === 'vertical') {
        return (
            <div>
                {title && <FeatureTitle className={`text-center ${titleClassName}`} title={title} />}


                {customImage && (
                    <>{customImage}</>
                )}

                {image?.bg && (
                    <div className="mt-8 relative">
                        {image?.html && (
                            <>{image.html}</>
                        )}
                        <Image
                            unoptimized
                            src={image.bg.src}
                            alt={image.bg.alt || ''}
                            width={image.bg.width || 0}
                            height={image.bg.height || 0}
                            className={`w-full h-auto ${image.bg.className || ''}`}
                        />
                        {image?.inner && (
                            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-auto ${image.inner.className || ''}`}>
                                <Image
                                    unoptimized
                                    disable-data-aos="zoom-in"
                                    disable-data-aos-delay="200"
                                    src={image.inner.src}
                                    alt={image.inner.alt || ''}
                                    width={image.inner.width || 0}
                                    height={image.inner.height || 0}
                                />
                            </div>
                        )}
                    </div>
                )}


                {contentList && contentList.length > 0 && (
                    <ul className="text-white mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-16 px-3 xl:px-0">
                        {/* xl:px-11 */}
                        {contentList.map((content, index) => (
                            <li key={index} className={`mt-3 sm:mt-0 relative transition-all duration-300 hover:border-natural-navy-dark ${content.spaceX ? 'px-6' : ''} ${content.borderTop ? `border-t border-natural-gray-border pt-4 sm:pt-6 ${content.link ? 'hover:border-natural-navy-dark transition-all duration-300' : ''}` : ''}`}>
                                {content.link && (
                                    <Link href={content.link} className="absolute inset-0"></Link>
                                )}
                                <div className="flex items-center gap-3">
                                    {content.icon && (
                                        <>{content.icon}</>
                                    )}
                                    <FeatureContentTitle title={content.head} className={content.headClassName} />
                                </div>
                                <FeatureContentText text={content.content} className={content.contentClassName} />
                            </li>
                        ))}
                    </ul>
                )}

                {endCustomHtml && (
                    <>{endCustomHtml}</>
                )}
            </div>
        )
    }

    return (
        <div className={`feature-card ${type === 'horizontal' ? '' : ''}`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${gridClassName || 'lg:gap-x-24 xl:gap-x-11'}`}>
                <div className={`${type === 'horizontal-reverse' ? 'md:order-2' : ''}`}>
                    <div className={`h-full flex flex-col justify-between ${contentMainClassName || ''}`}>
                        {title && <FeatureTitle title={title} className={titleClassName} />}
                        <div>
                            <ul className="text-white mt-8 md:mt-0 max-w-[454px]">
                                {contentList.map((content, index) => (
                                    <li key={index} className={`relative ${index === 0 ? '' : 'mt-4 sm:mt-6'} ${content.spaceX ? 'px-6' : ''} ${content.borderTop ? `border-t border-natural-gray-border pt-4 sm:pt-6 ${content.link ? 'hover:border-natural-navy-dark transition-all duration-300' : ''}` : ''}`}>
                                        {content.link && (
                                            <Link href={content.link} className="absolute inset-0"></Link>
                                        )}
                                        <FeatureContentTitle title={content.head} className={content.headClassName} />
                                        <FeatureContentText text={content.content} html={content.html} className={content.contentClassName} />
                                    </li>
                                ))}
                            </ul>
                            {buttons && buttons.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-8 sm:mt-10 lg:mt-14">
                                    {buttons.map((button, index) => (
                                        <div key={index} className={`${button.spaceX ? 'px-6' : ''}`}><Button {...button} inline>{button.text}</Button></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`relative mt-8 md:mt-0 ${type === 'horizontal-reverse' ? 'md:order-1 text-left' : 'text-right'}`}>
                    <div className="inline-block relative w-full md:w-auto">
                        {image?.bg && (
                            <Image
                                unoptimized
                                src={image.bg.src}
                                alt={image.bg.alt || ''}
                                width={image.bg.width || 0}
                                height={image.bg.height || 0}
                                className={`w-full h-auto ${image.bg.className || ''}`}
                            />
                        )}
                        {image?.inner && (
                            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-auto ${image.inner.className || ''}`}>
                                <Image
                                    unoptimized
                                    disable-data-aos="zoom-in"
                                    disable-data-aos-delay="200"
                                    className={`w-full h-auto`}
                                    src={image.inner.src}
                                    alt={image.inner.alt || ''}
                                    width={image.inner.width || 0}
                                    height={image.inner.height || 0}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureCard;
