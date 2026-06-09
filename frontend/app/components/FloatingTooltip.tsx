import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    safePolygon,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type FloatingTooltipProps = {
    children: React.ReactNode;
};

export default function FloatingTooltip({ children }: FloatingTooltipProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: "top",
        whileElementsMounted: autoUpdate,
        middleware: [offset(8), flip(), shift({ padding: 5 })],
    });

    const hover = useHover(context, {
        move: false,
        handleClose: safePolygon({buffer: 0.1}),
    });
    const click = useClick(context)
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        click,
        focus,
        dismiss,
        role,
    ]);

    return (
        <>
            <button
                type="button"
                ref={refs.setReference}
                {...getReferenceProps()}
                className="mx-1"
            >
                <FontAwesomeIcon icon={["far", "circle-question"]} height={16} width={16}/>
            </button>
            <FloatingPortal>
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className={`
            z-50 max-w-xs rounded bg-slate-800 px-3 py-1.5 text-sm font-medium text-white shadow-md 
            pointer-events-auto transition-opacity duration-200 ease-in-out
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
                    {...getFloatingProps()}
                >
                    {children}
                </div>
            </FloatingPortal>
        </>
    );
}
