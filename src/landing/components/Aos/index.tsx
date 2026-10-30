"use client"
import { useEffect } from "react";

// Scroll reveal for elements marked data-aos="…". A drop-in for AOS 2.3.4
// (unmaintained since 2022) with the options this site used: 300ms, "ease",
// 120px offset, animate once, disabled on mobile. The animations themselves
// are in styles/aos.css; per-element data-aos-duration/-delay/-easing work
// as before.

const DURATION = 300;
const EASING = "ease";
const OFFSET = 120;

const EASINGS: Record<string, string> = {
    linear: "cubic-bezier(.25, .25, .75, .75)",
    ease: "cubic-bezier(.25, .1, .25, 1)",
    "ease-in": "cubic-bezier(.42, 0, 1, 1)",
    "ease-out": "cubic-bezier(0, 0, .58, 1)",
    "ease-in-out": "cubic-bezier(.42, 0, .58, 1)",
    "ease-in-back": "cubic-bezier(.6, -.28, .735, .045)",
    "ease-out-back": "cubic-bezier(.175, .885, .32, 1.275)",
    "ease-in-out-back": "cubic-bezier(.68, -.55, .265, 1.55)",
    "ease-in-sine": "cubic-bezier(.47, 0, .745, .715)",
    "ease-out-sine": "cubic-bezier(.39, .575, .565, 1)",
    "ease-in-out-sine": "cubic-bezier(.445, .05, .55, .95)",
    "ease-in-quad": "cubic-bezier(.55, .085, .68, .53)",
    "ease-out-quad": "cubic-bezier(.25, .46, .45, .94)",
    "ease-in-out-quad": "cubic-bezier(.455, .03, .515, .955)",
};

// Phones and tablets, as AOS's "mobile" detection meant in practice.
const MOBILE_UA = /android|iphone|ipod|ipad|iemobile|blackberry|opera m(ob|in)i|mobile|silk|kindle|playbook/i;

const ATTRS = ["data-aos", "data-aos-easing", "data-aos-duration", "data-aos-delay"];

const ms = (value: string | undefined, fallback: number) => {
    const n = Number(value);
    return `${Number.isFinite(n) && value ? n : fallback}ms`;
};

const Aos = () => {
    useEffect(() => {
        const isMobile = MOBILE_UA.test(navigator.userAgent);
        const pending = new Set<HTMLElement>();
        let frame = 0;

        // Elements already on the page and any added later (client navigation).
        const collect = () => {
            document.querySelectorAll<HTMLElement>("[data-aos]:not([data-aos-init])").forEach(el => {
                if (isMobile) {
                    // Show it as-is, without animation (what AOS did on mobile).
                    ATTRS.forEach(attr => el.removeAttribute(attr));
                    return;
                }
                el.setAttribute("data-aos-init", "");
                el.style.transitionDuration = ms(el.dataset.aosDuration, DURATION);
                el.style.transitionTimingFunction = EASINGS[el.dataset.aosEasing ?? EASING] ?? EASINGS[EASING];
                pending.add(el);
            });
        };

        // Animate everything whose top has come within OFFSET of the bottom of
        // the viewport, including elements already scrolled past.
        const reveal = () => {
            frame = 0;
            const trigger = window.innerHeight - OFFSET;
            pending.forEach(el => {
                if (el.getBoundingClientRect().top > trigger) return;
                el.style.transitionDelay = ms(el.dataset.aosDelay, 0);
                el.setAttribute("data-aos-animate", "");
                pending.delete(el);
            });
        };

        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(() => { collect(); reveal(); });
        };

        const mutations = new MutationObserver(schedule);
        mutations.observe(document.body, { childList: true, subtree: true });
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        schedule();

        return () => {
            mutations.disconnect();
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            cancelAnimationFrame(frame);
        };
    }, []);

    return null
}

export default Aos;
